import { Issue } from '../models/Issue.js';
import { Notification } from '../models/Notification.js';

// Get tasks assigned to the logged-in worker
export const getAssignedTasks = async (req, res) => {
  try {
    const { status } = req.query;
    const query = { assignedWorker: req.user._id };

    if (status && status !== 'All') {
      query.status = status;
    }

    const tasks = await Issue.find(query)
      .populate('reportedBy', 'name email department phone avatar')
      .sort({ priorityScore: -1, createdAt: -1 });

    return res.status(200).json({ success: true, tasks });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Worker acknowledges the assigned task
export const acknowledgeTask = async (req, res) => {
  try {
    const issue = await Issue.findOne({
      _id: req.params.id,
      assignedWorker: req.user._id,
    });

    if (!issue) {
      return res.status(404).json({
        success: false,
        message: 'Task not found or you are not assigned to this issue.',
      });
    }

    issue.status = 'ACKNOWLEDGED';
    issue.acknowledgedAt = new Date();
    issue.timeline.push({
      status: 'ACKNOWLEDGED',
      changedBy: req.user._id,
      note: 'Maintenance worker acknowledged and accepted the task.',
      timestamp: new Date(),
    });

    await issue.save();

    // Notify the reporter
    await Notification.create({
      recipient: issue.reportedBy,
      sender: req.user._id,
      issueId: issue._id,
      title: 'Task Acknowledged',
      message: `Worker ${req.user.name} has acknowledged your complaint and scheduled work.`,
      type: 'STATUS_CHANGE',
    });

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
    const issue = await Issue.findOne({
      _id: req.params.id,
      assignedWorker: req.user._id,
    });

    if (!issue) {
      return res.status(404).json({
        success: false,
        message: 'Task not found or not assigned to you.',
      });
    }

    issue.status = 'IN_PROGRESS';
    issue.inProgressAt = new Date();
    issue.timeline.push({
      status: 'IN_PROGRESS',
      changedBy: req.user._id,
      note: 'Work has commenced on-site by maintenance staff.',
      timestamp: new Date(),
    });

    await issue.save();

    await Notification.create({
      recipient: issue.reportedBy,
      sender: req.user._id,
      issueId: issue._id,
      title: 'Work In Progress 🔨',
      message: `Maintenance technician ${req.user.name} is actively working on "${issue.title}".`,
      type: 'STATUS_CHANGE',
    });

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
    const issue = await Issue.findOne({
      _id: req.params.id,
      assignedWorker: req.user._id,
    });

    if (!issue) {
      return res.status(404).json({
        success: false,
        message: 'Task not found or not assigned to you.',
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

    if (!workNotes) {
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
      workNotes,
      completedAt: new Date(),
    };

    issue.timeline.push({
      status: 'RESOLVED',
      changedBy: req.user._id,
      note: `Task completed. Notes: ${workNotes}`,
      timestamp: new Date(),
    });

    await issue.save();

    // Trigger verification request notification to reporter
    await Notification.create({
      recipient: issue.reportedBy,
      sender: req.user._id,
      issueId: issue._id,
      title: '🎉 Issue Marked Resolved! Please Verify',
      message: `Worker ${req.user.name} has completed maintenance on "${issue.title}". Please verify the fix and rate the service!`,
      type: 'VERIFICATION_REQUEST',
    });

    return res.status(200).json({
      success: true,
      message: 'Task marked as resolved. User verification requested.',
      issue,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
