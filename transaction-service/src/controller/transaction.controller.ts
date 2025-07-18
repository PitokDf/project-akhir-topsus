import { Request, Response } from 'express';
import * as TransactionService from '../service/transaction.service';
import { CreateTransactionInput, UpdateTransactionStatusInput } from '../schemas/transaction.schema';
import { ResponseUtil } from '../utils/response';
import { asyncHandler } from '../utils/async-handler';

export const createTransactionHandler = asyncHandler<{}, any, CreateTransactionInput>(
    async (req, res) => {
        const transaction = await TransactionService.createTransaction(req.body);
        return ResponseUtil.success(res, { ...transaction }, 201, 'Transaction created successfully');
    }
);

export const getTransactionStatsHandler = asyncHandler(
    async (req: Request, res: Response) => {
        const stats = await TransactionService.getTransactionStats();
        return ResponseUtil.success(res, { data: stats });
    }
);

export const getTransactionHandler = asyncHandler<{ id: string }>(
    async (req, res) => {
        const transaction = await TransactionService.getTransactionById(req.params.id);
        if (!transaction) {
            return ResponseUtil.notFound(res, 'Transaction not found');
        }
        return ResponseUtil.success(res, { data: transaction });
    }
);

export const getTransactionsHandler = asyncHandler(
    async (req, res) => {
        const transactions = await TransactionService.getAllTransactions(req.query);
        return ResponseUtil.success(res, transactions);
    }
);

export const updateTransactionStatusHandler = asyncHandler<{ id: string }, any, UpdateTransactionStatusInput>(
    async (req, res) => {
        const { id } = req.params;
        const { status } = req.body;

        const updatedTransaction = await TransactionService.updateTransactionStatus(id, status);

        return ResponseUtil.success(res, { data: updatedTransaction }, 200, 'Transaction status updated successfully');
    }
);

export const cancelTransactionHandler = asyncHandler<{ id: string }>(
    async (req, res) => {
        const { id } = req.params;
        const cancelledTransaction = await TransactionService.cancelTransaction(id);
        return ResponseUtil.success(res, { data: cancelledTransaction }, 200, 'Transaction cancelled successfully');
    }
);