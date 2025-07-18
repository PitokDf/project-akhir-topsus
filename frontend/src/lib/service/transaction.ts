import api from '@/lib/axios';
import { Stats, CreateTransactionResponse, Transaction, PaginatedResponse } from '../types';

interface TransactionInputData {
    paymentMethod: "qris" | "cash",
    items: { menuId: number, quantity: number }[],
    userId: string
}

interface GetTransactionsParams {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    paymentMethod?: string;
}


export const transactionService = {
    getAllTransactions: async (params: GetTransactionsParams): Promise<PaginatedResponse<Transaction>> => {
        const response = await api.get('/transaction/transactions', { params });
        return response.data.data;
    },
    createTransaction: async (data: TransactionInputData): Promise<CreateTransactionResponse> => {
        const response = await api.post(`/transaction/transactions`, data)
        return response.data
    },

    getTransactionStatistics: async (): Promise<Stats> => {
        const response = await api.get("/transaction/transactions/stats")

        return response.data.data.data
    },

    getTransactionById: async (id: string) => {
        const response = await api.get(
            `/transaction/transactions/${id}`
        );

        return response.data.data
    },

    cancelTransaction: async (id: string) => {
        const response = await api.post(`/transaction/transactions/${id}/cancel`);
        return response.data;
    },
};