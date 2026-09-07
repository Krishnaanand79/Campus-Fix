import express from 'express';
import { getDashboardStats } from '../controllers/analyticsController.js';
import { verifyToken, checkRole } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(verifyToken, checkRole(['ADMIN']));

router.get('/dashboard', getDashboardStats);

export default router;
