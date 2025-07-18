import { db as prisma } from '../config/prisma';
import { core } from '../config/midtrans';
import * as TransactionRepository from '../repositories/transaction.repository';
import { CreateTransactionInput } from '../schemas/transaction.schema';
import { AppError } from '../errors/app-error';
import { HttpStatus } from '../constants/http-status';
import { io } from '../app';

export const createTransaction = async (input: CreateTransactionInput) => {
    const { items, paymentMethod, userId } = input;
    console.log(items);

    // Get menu details and calculate totals
    const menuIds = items.map((item) => item.menuId);
    const menus = await prisma.menu.findMany({
        where: { id: { in: menuIds } },
    });

    if (menus.length !== menuIds.length) {
        throw new AppError('One or more menu items not found', HttpStatus.NOT_FOUND);
    }

    let totalAmount = 0;
    const transactionItems = items.map((item) => {
        const menu = menus.find((m) => m.id === item.menuId)!;
        const itemTotal = menu.price * item.quantity;
        totalAmount += itemTotal;
        return {
            menuId: item.menuId,
            quantity: item.quantity,
            priceAtSale: menu.price,
            name: menu.name,
            itemTotal,
        };
    });

    const transactionData = {
        userId,
        totalAmount,
        paymentMethod,
        items: transactionItems,
        status: paymentMethod === 'qris' ? 'pending' : 'completed',
    };

    const newTransaction = await TransactionRepository.createTransaction(transactionData);

    if (paymentMethod === 'qris') {
        const parameter = {
            payment_type: 'qris',
            item_details: transactionItems.map((item) => ({
                id: item.menuId,
                name: item.name,
                quantity: item.quantity,
                price: item.priceAtSale
            })),
            transaction_details: {
                order_id: newTransaction.id.toString(),
                gross_amount: newTransaction.totalAmount,
            },
        };

        const midtransTransaction: any = await core.charge(parameter);

        const qrCodeAction = midtransTransaction.actions?.find(
            (action: any) => action.name === 'generate-qr-code'
        );
        const paymentUrl = qrCodeAction?.url;

        const updatedTransaction = await TransactionRepository.updateTransactionPayment(
            newTransaction.id,
            midtransTransaction.transaction_id,
            paymentUrl
        );

        return {
            ...updatedTransaction,
            paymentToken: midtransTransaction.transaction_id,
            paymentUrl: paymentUrl,
        };
    }

    // io.emit('transaction:update', newTransaction);
    return newTransaction;
};

export const getTransactionById = async (id: string) => {
    return TransactionRepository.findTransactionById(id);
};

export const getTransactionStats = async () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayIncome = await TransactionRepository.getTodayIncome(today, tomorrow);
    const todayTransaction = await TransactionRepository.getTodayTransactionCount(today, tomorrow);

    return { todayIncome, todayTransaction };
};

export const updateTransactionStatus = async (id: string, status: 'PENDING' | 'SUCCESS' | 'CANCELLED' | 'FAILED' | 'EXPIRED') => {
    const transaction = await TransactionRepository.findTransactionById(id);
    if (!transaction) {
        throw new AppError('Transaction not found', HttpStatus.NOT_FOUND);
    }

    const updatedTransaction = await TransactionRepository.updateTransactionStatus(id, status);
    io.emit('transaction:update', updatedTransaction);
    return updatedTransaction;
};

export const getAllTransactions = async (query: any) => {
    const { page = 1, limit = 10, search, status, paymentMethod } = query;
    const options = {
        page: Number(page),
        limit: Number(limit),
        search: search as string | undefined,
        status: status as string | undefined,
        paymentMethod: paymentMethod as string | undefined,
    };
    return TransactionRepository.findAll(options);
};

export const cancelTransaction = async (id: string) => {
    const transaction = await TransactionRepository.findTransactionById(id);

    if (!transaction) {
        throw new AppError('Transaction not found', HttpStatus.NOT_FOUND);
    }

    if (transaction.paymentMethod !== 'qris' || !transaction.paymentToken) {
        throw new AppError('Only QRIS transactions can be cancelled through this endpoint', HttpStatus.BAD_REQUEST);
    }

    await core.transaction.cancel(transaction.paymentToken);

    const updatedTransaction = await TransactionRepository.updateTransactionStatus(id, 'CANCELLED');
    io.emit('transaction:update', updatedTransaction);
    return updatedTransaction;
};