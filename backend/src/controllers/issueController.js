import { Issue } from '../models/Issue.js';
import { Rating } from '../models/Rating.js';
import { Notification } from '../models/Notification.js';
import { User } from '../models/User.js';
import { calculatePriorityScore } from '../utils/priorityCalculator.js';
import { detectDuplicates } from '../utils/duplicateDetector.js';

// Create a new maintenance issue
export const createIssue = async (req, res) => {
  try {
    const { title, description, category, location, severity, images, videos } = req.body;

    if (!title || !description || !category || !location || !location.block || !location.area) {
      return res.status(400).json({
        success: false,
        message: 'Title, description, category, and structured location (block & area) are required.',
      });
    }

    // Process uploaded files if any arrived via multer
    const uploadedImages = images || [];
    const uploadedVideos = videos || [];
    if (req.files && Array.isArray(req.files)) {
      req.files.forEach((file) => {
        const fileUrl = `/uploads/${file.filename}`;
        if (file.mimetype.startsWith('video/')) {
          uploadedVideos.push(fileUrl);
        } else {
          uploadedImages.push(fileUrl);
        }
      });
    }

    const initialIssue = {
      title,
      description,
      category,
      location,
      severity: severity || 'MEDIUM',
      upvotesCount: 1,
      createdAt: new Date(),
    };

    const { score, priority } = calculatePriorityScore(initialIssue);

    const newIssue = await Issue.create({
      title,
      description,
      category,
      location,
      images: uploadedImages,
      videos: uploadedVideos,
      reportedBy: req.user._id,
      upvotes: [req.user._id],
      upvotesCount: 1,
      severity: severity || 'MEDIUM',
      priority,
      priorityScore: score,
      status: 'REPORTED',
      timeline: [
        {
          status: 'REPORTED',
          changedBy: req.user._id,
          note: 'Issue reported by campus user',
          timestamp: new Date(),
        },
      ],
    });

    // Notify admins if created with CRITICAL priority
    if (priority === 'CRITICAL') {
      const admins = await User.find({ role: 'ADMIN' });
      const notifications = admins.map((admin) => ({
        recipient: admin._id,
        sender: req.user._id,
        issueId: newIssue._id,
        title: '🚨 CRITICAL Issue Reported',
        message: `High severity issue reported at ${location.block}: "${title}"`,
        type: 'HIGH_PRIORITY_ALERT',
      }));
      if (notifications.length > 0) {
        await Notification.insertMany(notifications);
      }
    }

    const populatedIssue = await Issue.findById(newIssue._id).populate('reportedBy', 'name email department avatar');

    return res.status(201).json({
      success: true,
      message: 'Complaint submitted successfully',
      issue: populatedIssue,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Check for duplicate issues before submission
export const checkDuplicatesEndpoint = async (req, res) => {
  try {
    const { title, description, category, location } = req.body;
    const duplicates = await detectDuplicates({ title, description, category, location });
    return res.status(200).json({
      success: true,
      count: duplicates.length,
      duplicates,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Public issue feed with filtering, search, and sorting
export const getIssues = async (req, res) => {
  try {
    const { search, category, block, status, priority, sortBy, page = 1, limit = 12 } = req.query;

    const query = {};

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { 'location.area': { $regex: search, $options: 'i' } },
      ];
    }

    if (category && category !== 'All') {
      query.category = category;
    }

    if (block && block !== 'All') {
      query['location.block'] = block;
    }

    if (status && status !== 'All') {
      query.status = status;
    }

    if (priority && priority !== 'All') {
      query.priority = priority;
    }

    // Sort order
    let sort = { priorityScore: -1, createdAt: -1 };
    if (sortBy === 'votes') {
      sort = { upvotesCount: -1, createdAt: -1 };
    } else if (sortBy === 'recent') {
      sort = { createdAt: -1 };
    } else if (sortBy === 'oldest') {
      sort = { createdAt: 1 };
    }

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Issue.countDocuments(query);

    const issues = await Issue.find(query)
      .populate('reportedBy', 'name department avatar')
      .populate('assignedWorker', 'name department phone avatar')
      .sort(sort)
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

// Get single issue with full timeline, assigned worker, and rating
export const getIssueById = async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id)
      .populate('reportedBy', 'name email department phone avatar')
      .populate('assignedWorker', 'name email department phone avatar specialties')
      .populate('timeline.changedBy', 'name role department');

    if (!issue) {
      return res.status(404).json({ success: false, message: 'Issue not found' });
    }

    const rating = await Rating.findOne({ issueId: issue._id }).populate('userId', 'name avatar');

    return res.status(200).json({
      success: true,
      issue,
      rating,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Upvote / "+1 I'm facing this too"
export const upvoteIssue = async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id);
    if (!issue) {
      return res.status(404).json({ success: false, message: 'Issue not found' });
    }

    const userId = req.user._id;
    const hasUpvoted = issue.upvotes.some((id) => id.toString() === userId.toString());

    if (hasUpvoted) {
      // User can toggle remove their upvote
      issue.upvotes = issue.upvotes.filter((id) => id.toString() !== userId.toString());
    } else {
      issue.upvotes.push(userId);
    }

    issue.upvotesCount = issue.upvotes.length;

    // Recalculate priority with new community support count
    const { score, priority } = calculatePriorityScore(issue);
    issue.priorityScore = score;
    issue.priority = priority;

    await issue.save();

    // If threshold crossed (e.g. 5, 15, 30 votes), notify admins
    if ([5, 15, 30, 50].includes(issue.upvotesCount) && !hasUpvoted) {
      const admins = await User.find({ role: 'ADMIN' });
      const notifications = admins.map((admin) => ({
        recipient: admin._id,
        sender: userId,
        issueId: issue._id,
        title: `🔥 High Community Support (${issue.upvotesCount} +1s)`,
        message: `Issue "${issue.title}" at ${issue.location.block} now affects ${issue.upvotesCount} users.`,
        type: 'HIGH_PRIORITY_ALERT',
      }));
      if (notifications.length > 0) {
        await Notification.insertMany(notifications);
      }
    }

    return res.status(200).json({
      success: true,
      hasUpvoted: !hasUpvoted,
      upvotesCount: issue.upvotesCount,
      priority: issue.priority,
      priorityScore: issue.priorityScore,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Verification & Reopen Loop: reporter verifies resolution
export const verifyResolution = async (req, res) => {
  try {
    const { isSatisfied, reopenReason, rating, review } = req.body;
    const issue = await Issue.findById(req.params.id);

    if (!issue) {
      return res.status(404).json({ success: false, message: 'Issue not found' });
    }

    // Only the original reporter or admin can verify
    if (
      issue.reportedBy.toString() !== req.user._id.toString() &&
      req.user.role !== 'ADMIN'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Only the original reporter or an administrator can verify this resolution.',
      });
    }

    if (isSatisfied) {
      // Reporter confirms issue is fixed!
      issue.status = 'CLOSED';
      issue.closedAt = new Date();
      issue.verification = {
        verifiedBy: req.user._id,
        verifiedAt: new Date(),
        isSatisfied: true,
        reopenReason: '',
      };
      issue.timeline.push({
        status: 'CLOSED',
        changedBy: req.user._id,
        note: `Resolution confirmed by user: "${review || 'Satisfied with the fix'}"`,
        timestamp: new Date(),
      });

      await issue.save();

      // Save rating if provided
      if (rating && issue.assignedWorker) {
        await Rating.findOneAndUpdate(
          { issueId: issue._id },
          {
            issueId: issue._id,
            userId: req.user._id,
            workerId: issue.assignedWorker,
            rating: Number(rating),
            review: review || '',
          },
          { upsert: true, new: true }
        );

        // Notify worker about positive rating
        await Notification.create({
          recipient: issue.assignedWorker,
          sender: req.user._id,
          issueId: issue._id,
          title: '⭐ Task Rated & Closed!',
          message: `The user verified your work on "${issue.title}" and rated it ${rating}/5 stars.`,
          type: 'RATING_RECEIVED',
        });
      }
    } else {
      // Reporter says problem was NOT actually fixed!
      if (!reopenReason) {
        return res.status(400).json({
          success: false,
          message: 'Please provide a reason why the problem is not fixed.',
        });
      }

      issue.status = 'REOPENED';
      issue.verification = {
        verifiedBy: req.user._id,
        verifiedAt: new Date(),
        isSatisfied: false,
        reopenReason,
      };
      issue.timeline.push({
        status: 'REOPENED',
        changedBy: req.user._id,
        note: `Issue reopened by user. Reason: ${reopenReason}`,
        timestamp: new Date(),
      });

      // Recalculate priority to bump priority after reopening
      issue.priorityScore += 25;
      if (issue.priorityScore >= 75) issue.priority = 'CRITICAL';
      else if (issue.priorityScore >= 45) issue.priority = 'HIGH';

      await issue.save();

      // Notify admin and assigned worker immediately
      const admins = await User.find({ role: 'ADMIN' });
      const notifications = admins.map((admin) => ({
        recipient: admin._id,
        sender: req.user._id,
        issueId: issue._id,
        title: '⚠️ Issue Reopened by Reporter',
        message: `Reporter indicated "${issue.title}" is NOT fixed. Reason: ${reopenReason}`,
        type: 'REOPENED_ALERT',
      }));

      if (issue.assignedWorker) {
        notifications.push({
          recipient: issue.assignedWorker,
          sender: req.user._id,
          issueId: issue._id,
          title: '⚠️ Task Reopened',
          message: `The user reported your resolution for "${issue.title}" was incomplete: "${reopenReason}"`,
          type: 'REOPENED_ALERT',
        });
      }

      await Notification.insertMany(notifications);
    }

    return res.status(200).json({
      success: true,
      message: isSatisfied ? 'Issue closed with your feedback. Thank you!' : 'Issue reopened and sent back to admin.',
      issue,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Issues reported by the current logged in user
export const getMyIssues = async (req, res) => {
  try {
    const issues = await Issue.find({ reportedBy: req.user._id })
      .populate('assignedWorker', 'name department avatar phone')
      .sort({ createdAt: -1 });

    return res.status(200).json({ success: true, issues });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Issues upvoted (+1'd) by the current user
export const getMyUpvotedIssues = async (req, res) => {
  try {
    const issues = await Issue.find({ upvotes: req.user._id })
      .populate('reportedBy', 'name department avatar')
      .sort({ updatedAt: -1 });

    return res.status(200).json({ success: true, issues });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
