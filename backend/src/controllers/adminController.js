import { Issue } from '../models/Issue.js';
import { User } from '../models/User.js';
import { Category } from '../models/Category.js';
import { Notification } from '../models/Notification.js';
import { calculatePriorityScore } from '../utils/priorityCalculator.js';

// Get issues for admin dashboard with complete analytics metadata
export const getAdminIssues = async (req, res) => {
  try {
    const { status, priority, category, worker, search, page = 1, limit = 20 } = req.query;
    const query = {};

    if (status && status !== 'All') query.status = status;
    if (priority && priority !== 'All') query.priority = priority;
    if (category && category !== 'All') query.category = category;
    if (worker && worker !== 'All') query.assignedWorker = worker;

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { 'location.block': { $regex: search, $options: 'i' } },
        { 'location.area': { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Issue.countDocuments(query);

    const issues = await Issue.find(query)
      .populate('reportedBy', 'name email department avatar')
      .populate('assignedWorker', 'name email department phone avatar specialties')
      .sort({ priorityScore: -1, createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    return res.status(200).json({
      success: true,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
      issues,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Admin status transition
export const updateIssueStatus = async (req, res) => {
  try {
    const { status, note } = req.body;
    const issue = await Issue.findById(req.params.id);

    if (!issue) {
      return res.status(404).json({ success: false, message: 'Issue not found' });
    }

    const oldStatus = issue.status;
    issue.status = status;

    if (status === 'CLOSED') {
      issue.closedAt = new Date();
    }

    issue.timeline.push({
      status,
      changedBy: req.user._id,
      note: note || `Status updated from ${oldStatus} to ${status} by Admin`,
      timestamp: new Date(),
    });

    await issue.save();

    // Notify the reporter
    await Notification.create({
      recipient: issue.reportedBy,
      sender: req.user._id,
      issueId: issue._id,
      title: `Issue Status: ${status.replace('_', ' ')}`,
      message: `Your complaint "${issue.title}" status is now ${status}. ${note || ''}`,
      type: 'STATUS_CHANGE',
    });

    return res.status(200).json({
      success: true,
      message: `Issue status updated to ${status}`,
      issue,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Admin manual priority override
export const updateIssuePriority = async (req, res) => {
  try {
    const { priority, severity } = req.body;
    const issue = await Issue.findById(req.params.id);

    if (!issue) {
      return res.status(404).json({ success: false, message: 'Issue not found' });
    }

    if (severity) issue.severity = severity;
    if (priority) issue.priority = priority;

    const { score } = calculatePriorityScore(issue);
    issue.priorityScore = score;

    issue.timeline.push({
      status: issue.status,
      changedBy: req.user._id,
      note: `Priority calibrated to ${priority || issue.priority} (Severity: ${severity || issue.severity})`,
      timestamp: new Date(),
    });

    await issue.save();

    return res.status(200).json({
      success: true,
      message: 'Priority updated successfully',
      issue,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Assign worker to an issue
export const assignWorker = async (req, res) => {
  try {
    const { workerId, deadline, instructions } = req.body;
    const issue = await Issue.findById(req.params.id);

    if (!issue) {
      return res.status(404).json({ success: false, message: 'Issue not found' });
    }

    const worker = await User.findById(workerId);
    if (!worker || worker.role !== 'WORKER') {
      return res.status(400).json({ success: false, message: 'Invalid worker selected' });
    }

    // Previous worker adjustment
    if (issue.assignedWorker && issue.assignedWorker.toString() !== workerId) {
      await User.findByIdAndUpdate(issue.assignedWorker, { $inc: { activeTasksCount: -1 } });
    }

    issue.assignedWorker = workerId;
    issue.assignedAt = new Date();
    issue.status = 'ASSIGNED';
    if (deadline) issue.deadline = new Date(deadline);

    issue.timeline.push({
      status: 'ASSIGNED',
      changedBy: req.user._id,
      note: `Assigned to ${worker.name}. Instructions: ${instructions || 'Resolve problem promptly'}`,
      timestamp: new Date(),
    });

    await issue.save();
    await User.findByIdAndUpdate(workerId, { $inc: { activeTasksCount: 1 } });

    // Notify the worker
    await Notification.create({
      recipient: workerId,
      sender: req.user._id,
      issueId: issue._id,
      title: '📋 New Task Assigned',
      message: `You have been assigned to "${issue.title}" at ${issue.location.block} - ${issue.location.area}. Priority: ${issue.priority}.`,
      type: 'ASSIGNMENT',
    });

    // Notify the reporter
    await Notification.create({
      recipient: issue.reportedBy,
      sender: req.user._id,
      issueId: issue._id,
      title: 'Worker Dispatched',
      message: `Maintenance technician ${worker.name} has been assigned to your complaint.`,
      type: 'STATUS_CHANGE',
    });

    const populatedIssue = await Issue.findById(issue._id)
      .populate('reportedBy', 'name email department phone avatar')
      .populate('assignedWorker', 'name email department phone avatar specialties');

    return res.status(200).json({
      success: true,
      message: `Task successfully assigned to ${worker.name}`,
      issue: populatedIssue,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// List all maintenance workers with workload
export const getWorkers = async (req, res) => {
  try {
    const workers = await User.find({ role: 'WORKER' }).select('-password');
    
    // Enrich with live active task counts
    const enrichedWorkers = await Promise.all(
      workers.map(async (worker) => {
        const activeCount = await Issue.countDocuments({
          assignedWorker: worker._id,
          status: { $in: ['ASSIGNED', 'ACKNOWLEDGED', 'IN_PROGRESS'] },
        });
        const completedCount = await Issue.countDocuments({
          assignedWorker: worker._id,
          status: { $in: ['RESOLVED', 'CLOSED'] },
        });
        return {
          ...worker.toObject(),
          activeTasks: activeCount,
          completedTasks: completedCount,
        };
      })
    );

    return res.status(200).json({ success: true, workers: enrichedWorkers });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Categories management
export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    return res.status(200).json({ success: true, categories });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const createCategory = async (req, res) => {
  try {
    const { name, icon, description, severityWeight } = req.body;
    const category = await Category.create({ name, icon, description, severityWeight });
    return res.status(201).json({ success: true, category });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.params.id);
    return res.status(200).json({ success: true, message: 'Category deleted' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
