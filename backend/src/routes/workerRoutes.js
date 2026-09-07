import express from 'express';
import {
  getAssignedTasks,
  acknowledgeTask,
  startTask,
  resolveTask,
} from '../controllers/workerController.js';
import { verifyToken, checkRole } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.use(verifyToken, checkRole(['WORKER', 'ADMIN']));

router.get('/tasks', getAssignedTasks);
router.put('/tasks/:id/acknowledge', acknowledgeTask);
router.put('/tasks/:id/start', startTask);
router.put('/tasks/:id/resolve', upload.array('proofMedia', 5), resolveTask);

export default router;
