import { Request, Response } from 'express';
import * as TransactionService from '../service/transaction.service';
import { CreateTransactionInput } from '../schemas/transaction.schema';
import { ResponseUtil } from '../utils/response';
import { asyncHandler } from '../utils/async-handler';

export const createTransactionHandler = asyncHandler(
    async (req: Request<{}, {}, CreateTransactionInput>, res: Response) => {
        const transaction = await TransactionService.createTransaction(req.body);
        return ResponseUtil.success(res, { data: transaction }, 201, 'Transaction created successfully');
    }
);

export const getTransactionStatsHandler = asyncHandler(
    async (req: Request, res: Response) => {
        const stats = await TransactionService.getTransactionStats();
        return ResponseUtil.success(res, { data: stats });
    }
);

export const getTransactionHandler = asyncHandler(
    async (req: Request, res: Response) => {
        const transaction = await TransactionService.getTransactionById(req.params.id);
        if (!transaction) {
            return ResponseUtil.notFound(res, 'Transaction not found');
        }
        return ResponseUtil.success(res, { data: transaction });
    }
);