import express from 'express';
import { createRating, getWorkerRatings } from '../controllers/ratingController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', verifyToken, createRating);
router.get('/worker/:workerId', getWorkerRatings);

export default router;
