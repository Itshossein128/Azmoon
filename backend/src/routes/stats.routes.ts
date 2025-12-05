import express from 'express';
import { getStats, getStudentPerformance, getStudentProgress, getQuestionStats, getFinancialStats } from '../controllers/stats.controller';

const router = express.Router();

router.get('/stats', getStats);
router.get('/stats/financial', getFinancialStats);
router.get('/stats/questions', getQuestionStats);
router.get('/stats/student/:userId', getStudentPerformance);
router.get('/stats/student/:userId/progress', getStudentProgress);

export default router;
