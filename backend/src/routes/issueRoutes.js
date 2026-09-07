import express from 'express';
import {
  createIssue,
  checkDuplicatesEndpoint,
  getIssues,
  getIssueById,
  upvoteIssue,
  verifyResolution,
  getMyIssues,
  getMyUpvotedIssues,
} from '../controllers/issueController.js';
import { verifyToken } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';

const router = express.Router();

// Public routes (anyone can see issues feed and single issue)
router.get('/', getIssues);
router.post('/check-duplicates', checkDuplicatesEndpoint);
router.get('/my', verifyToken, getMyIssues);
router.get('/my-upvotes', verifyToken, getMyUpvotedIssues);
router.get('/:id', getIssueById);

// Protected routes (authenticated users)
router.post('/', verifyToken, upload.array('media', 5), createIssue);
router.post('/:id/upvote', verifyToken, upvoteIssue);
router.post('/:id/verify', verifyToken, verifyResolution);

export default router;
