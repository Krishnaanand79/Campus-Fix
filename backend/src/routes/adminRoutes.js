import express from 'express';
import {
  getAdminIssues,
  updateIssueStatus,
  updateIssuePriority,
  assignWorker,
  getWorkers,
  getCategories,
  createCategory,
  deleteCategory,
} from '../controllers/adminController.js';
import { verifyToken, checkRole } from '../middleware/authMiddleware.js';

const router = express.Router();

// Admin only gate
router.use(verifyToken, checkRole(['ADMIN']));

router.get('/issues', getAdminIssues);
router.put('/issues/:id/status', updateIssueStatus);
router.put('/issues/:id/priority', updateIssuePriority);
router.post('/issues/:id/assign', assignWorker);
router.get('/workers', getWorkers);
router.get('/categories', getCategories);
router.post('/categories', createCategory);
router.delete('/categories/:id', deleteCategory);

export default router;
