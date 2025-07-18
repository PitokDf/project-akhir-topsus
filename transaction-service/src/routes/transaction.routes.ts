import { Router } from 'express';
import { cancelTransactionHandler, createTransactionHandler, getTransactionHandler, getTransactionsHandler, getTransactionStatsHandler, updateTransactionStatusHandler } from '../controller/transaction.controller';
import { validateSchema } from '../middleware/zod.middleware';
import { createTransactionSchema, updateTransactionStatusSchema } from '../schemas/transaction.schema';

const router = Router();

router.get('/', getTransactionsHandler);
router.post('/', validateSchema(createTransactionSchema), createTransactionHandler);
router.get('/stats', getTransactionStatsHandler);
router.get('/:id', getTransactionHandler);
router.patch('/:id/status', validateSchema(updateTransactionStatusSchema), updateTransactionStatusHandler);
router.post('/:id/cancel', cancelTransactionHandler);

export default router;