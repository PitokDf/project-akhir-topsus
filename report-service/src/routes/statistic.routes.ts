import { Router } from 'express';
import { getStatistics } from '../controller/statistic.controller';

const router = Router();

router.get('/statistics', getStatistics);

export default router;