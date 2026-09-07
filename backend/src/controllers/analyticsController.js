import { Issue } from '../models/Issue.js';
import { User } from '../models/User.js';
import { Rating } from '../models/Rating.js';

export const getDashboardStats = async (req, res) => {
  try {
    const totalIssues = await Issue.countDocuments();
    const pendingIssues = await Issue.countDocuments({
      status: { $in: ['REPORTED', 'UNDER_REVIEW'] },
    });
    const inProgressIssues = await Issue.countDocuments({
      status: { $in: ['ASSIGNED', 'ACKNOWLEDGED', 'IN_PROGRESS'] },
    });
    const resolvedIssues = await Issue.countDocuments({ status: 'RESOLVED' });
    const closedIssues = await Issue.countDocuments({ status: 'CLOSED' });
    const criticalIssues = await Issue.countDocuments({ priority: 'CRITICAL', status: { $ne: 'CLOSED' } });
    const reopenedIssues = await Issue.countDocuments({ status: 'REOPENED' });

    // Aggregation: Issues by Category
    const categoryAgg = await Issue.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    // Aggregation: Issues by Campus Location Block
    const locationAgg = await Issue.aggregate([
      { $group: { _id: '$location.block', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 8 },
    ]);

    // Aggregation: Issues by Priority
    const priorityAgg = await Issue.aggregate([
      { $group: { _id: '$priority', count: { $sum: 1 } } },
    ]);

    // Calculate Average Resolution Time (in hours) for closed/resolved issues
    const resolvedList = await Issue.find({
      resolvedAt: { $ne: null },
      createdAt: { $ne: null },
    }).select('createdAt resolvedAt');

    let avgResolutionHours = 0;
    if (resolvedList.length > 0) {
      const totalHours = resolvedList.reduce((acc, issue) => {
        const diffMs = new Date(issue.resolvedAt) - new Date(issue.createdAt);
        return acc + diffMs / (1000 * 60 * 60);
      }, 0);
      avgResolutionHours = (totalHours / resolvedList.length).toFixed(1);
    }

    // Worker Performance Table
    const workers = await User.find({ role: 'WORKER' }).select('name department specialties avatar');
    const workerStats = await Promise.all(
      workers.map(async (worker) => {
        const completed = await Issue.countDocuments({
          assignedWorker: worker._id,
          status: { $in: ['RESOLVED', 'CLOSED'] },
        });
        const active = await Issue.countDocuments({
          assignedWorker: worker._id,
          status: { $in: ['ASSIGNED', 'ACKNOWLEDGED', 'IN_PROGRESS'] },
        });
        const ratings = await Rating.find({ workerId: worker._id });
        const avgRating =
          ratings.length > 0
            ? (ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length).toFixed(1)
            : '5.0';

        return {
          id: worker._id,
          name: worker.name,
          department: worker.department,
          avatar: worker.avatar,
          completed,
          active,
          avgRating: Number(avgRating),
          ratingsCount: ratings.length,
        };
      })
    );

    return res.status(200).json({
      success: true,
      stats: {
        total: totalIssues,
        pending: pendingIssues,
        inProgress: inProgressIssues,
        resolved: resolvedIssues,
        closed: closedIssues,
        critical: criticalIssues,
        reopened: reopenedIssues,
        avgResolutionHours: Number(avgResolutionHours),
      },
      categories: categoryAgg.map((c) => ({ name: c._id, count: c.count })),
      locations: locationAgg.map((l) => ({ block: l._id || 'General', count: l.count })),
      priorities: priorityAgg.map((p) => ({ priority: p._id, count: p.count })),
      workers: workerStats,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
