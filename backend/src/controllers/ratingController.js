import { Rating } from '../models/Rating.js';
import { Issue } from '../models/Issue.js';

export const createRating = async (req, res) => {
  try {
    const { issueId, rating, review } = req.body;

    const issue = await Issue.findById(issueId);
    if (!issue) {
      return res.status(404).json({ success: false, message: 'Issue not found' });
    }

    if (!issue.assignedWorker) {
      return res.status(400).json({ success: false, message: 'Cannot rate an unassigned issue' });
    }

    const newRating = await Rating.findOneAndUpdate(
      { issueId },
      {
        issueId,
        userId: req.user._id,
        workerId: issue.assignedWorker,
        rating: Number(rating),
        review: review || '',
      },
      { upsert: true, new: true }
    );

    return res.status(201).json({ success: true, rating: newRating });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getWorkerRatings = async (req, res) => {
  try {
    const workerId = req.params.workerId;
    const ratings = await Rating.find({ workerId })
      .populate('userId', 'name avatar')
      .populate('issueId', 'title category location')
      .sort({ createdAt: -1 });

    const avgRating =
      ratings.length > 0
        ? (ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length).toFixed(1)
        : 0;

    return res.status(200).json({
      success: true,
      count: ratings.length,
      average: Number(avgRating),
      ratings,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
