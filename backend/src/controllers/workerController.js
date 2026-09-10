import { Issue } from '../models/Issue.js';
import { Notification } from '../models/Notification.js';

// Get tasks assigned to worker (or all/selected worker tasks if requested by Admin)
export const getAssignedTasks = async (req, res) => {
  try {
    const { status, workerId } = req.query;
    const query = {};

    // Role-aware assignment filtering
    if (req.user.role === 'WORKER') {
      // Maintenance worker sees only their own assigned work orders
      query.assignedWorker = req.user._id;
    } else if (req.user.role === 'ADMIN') {
      // Campus Admin can view a specific technician's queue or all dispatched tasks
      if (workerId && workerId.toUpperCase() !== 'ALL') {
        query.assignedWorker = workerId;
      } else {
        query.assignedWorker = { $ne: null };
      }
    } else {
      return res.status(403).json({ success: false, message: 'Unauthorized role for worker queue' });
    }

    // Status filtering with robust case-insensitivity
    if (status && status.toUpperCase() !== 'ALL') {
      const upperStatus = status.toUpperCase();
      if (upperStatus === 'RESOLVED') {
        // Show both pending verification and completed/closed work
        query.status = { $in: ['RESOLVED', 'CLOSED', 'USER_VERIFIED'] };
      } else {
        query.status = upperStatus;
      }
    }

    const tasks = await Issue.find(query)
      .populate('reportedBy', 'name email department phone avatar')
      .populate('assignedWorker', 'name email department phone avatar specialties')
      .sort({ priorityScore: -1, createdAt: -1 });

    return res.status(200).json({ success: true, count: tasks.length, tasks });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Worker acknowledges the assigned task
export const acknowledgeTask = async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id);

    if (!issue) {
      return res.status(404).json({
        success: false,
        message: 'Task not found.',
      });
    }

    const isAssigned =
      issue.assignedWorker?.toString() === req.user._id.toString() ||
      req.user.role === 'ADMIN';

    if (!isAssigned) {
      return res.status(403).json({
        success: false,
        message: 'You are not assigned to this issue.',
      });
    }

    issue.status = 'ACKNOWLEDGED';
    issue.acknowledgedAt = new Date();
    issue.timeline.push({
      status: 'ACKNOWLEDGED',
      changedBy: req.user._id,
      note: `Maintenance technician ${req.user.name} acknowledged and accepted the task.`,
      timestamp: new Date(),
    });

    await issue.save();

    // Notify the reporter
    if (issue.reportedBy) {
      await Notification.create({
        recipient: issue.reportedBy,
        sender: req.user._id,
        issueId: issue._id,
        title: 'Task Acknowledged',
        message: `Worker ${req.user.name} has acknowledged your complaint and scheduled work.`,
        type: 'STATUS_CHANGE',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Task acknowledged successfully',
      issue,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Worker marks task in progress
export const startTask = async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id);

    if (!issue) {
      return res.status(404).json({
        success: false,
        message: 'Task not found.',
      });
    }

    const isAssigned =
      issue.assignedWorker?.toString() === req.user._id.toString() ||
      req.user.role === 'ADMIN';

    if (!isAssigned) {
      return res.status(403).json({
        success: false,
        message: 'You are not assigned to this task.',
      });
    }

    issue.status = 'IN_PROGRESS';
    issue.inProgressAt = new Date();
    issue.timeline.push({
      status: 'IN_PROGRESS',
      changedBy: req.user._id,
      note: `Work has commenced on-site by ${req.user.name}.`,
      timestamp: new Date(),
    });

    await issue.save();

    if (issue.reportedBy) {
      await Notification.create({
        recipient: issue.reportedBy,
        sender: req.user._id,
        issueId: issue._id,
        title: 'Work In Progress 🔨',
        message: `Maintenance technician ${req.user.name} is actively working on "${issue.title}".`,
        type: 'STATUS_CHANGE',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Task marked as in progress',
      issue,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Worker uploads resolution proof and marks task as resolved
export const resolveTask = async (req, res) => {
  try {
    const { workNotes, beforeMedia, afterMedia } = req.body;
    const issue = await Issue.findById(req.params.id);

    if (!issue) {
      return res.status(404).json({
        success: false,
        message: 'Task not found.',
      });
    }

    const isAssigned =
      issue.assignedWorker?.toString() === req.user._id.toString() ||
      req.user.role === 'ADMIN';

    if (!isAssigned) {
      return res.status(403).json({
        success: false,
        message: 'You are not assigned to this task.',
      });
    }

    // Process uploaded proof files
    const proofAfter = afterMedia ? (Array.isArray(afterMedia) ? afterMedia : [afterMedia]) : [];
    const proofBefore = beforeMedia ? (Array.isArray(beforeMedia) ? beforeMedia : [beforeMedia]) : [];

    if (req.files && Array.isArray(req.files)) {
      req.files.forEach((file) => {
        proofAfter.push(`/uploads/${file.filename}`);
      });
    }

    if (!workNotes || !workNotes.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Please provide notes detailing the repair work done.',
      });
    }

    issue.status = 'RESOLVED';
    issue.resolvedAt = new Date();
    issue.proof = {
      beforeMedia: proofBefore.length > 0 ? proofBefore : (issue.images || []),
      afterMedia: proofAfter,
      workNotes: workNotes.trim(),
      completedAt: new Date(),
    };

    issue.timeline.push({
      status: 'RESOLVED',
      changedBy: req.user._id,
      note: `Task completed by ${req.user.name}. Notes: ${workNotes.trim()}`,
      timestamp: new Date(),
    });

    await issue.save();

    // Trigger verification request notification to reporter
    if (issue.reportedBy) {
      await Notification.create({
        recipient: issue.reportedBy,
        sender: req.user._id,
        issueId: issue._id,
        title: '🎉 Issue Marked Resolved! Please Verify',
        message: `Worker ${req.user.name} has completed maintenance on "${issue.title}". Please verify the fix and rate the service!`,
        type: 'VERIFICATION_REQUEST',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Task marked as resolved. User verification requested.',
      issue,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
