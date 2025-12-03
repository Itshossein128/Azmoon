import express from 'express';
import { getStats, getStudentPerformance } from '../controllers/stats.controller';

const router = express.Router();

router.get('/stats', getStats);
router.get('/stats/student/:userId', getStudentPerformance);

export default router;
