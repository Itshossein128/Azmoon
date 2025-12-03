import express from 'express';
import { getStats, getStudentPerformance, getStudentProgress } from '../controllers/stats.controller';

const router = express.Router();

router.get('/stats', getStats);
router.get('/stats/student/:userId', getStudentPerformance);
router.get('/stats/student/:userId/progress', getStudentProgress);

export default router;
