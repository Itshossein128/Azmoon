import express from 'express';
import { getStats } from '../controllers/stats.controller';

const router = express.Router();

router.get('/stats', getStats);

export default router;
