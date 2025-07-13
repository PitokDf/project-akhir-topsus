import { Router } from 'express';
import { createTransactionHandler, getTransactionHandler, getTransactionStatsHandler } from '../controller/transaction.controller';
import { validateSchema } from '../middleware/zod.middleware';
import { createTransactionSchema } from '../schemas/transaction.schema';

const router = Router();

router.post('/', validateSchema(createTransactionSchema), createTransactionHandler);
router.get('/stats', getTransactionStatsHandler);
router.get('/:id', getTransactionHandler);

export default router;