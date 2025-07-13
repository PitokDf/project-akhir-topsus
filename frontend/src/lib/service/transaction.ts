import api from '@/lib/axios';
import { Stats, CreateTransactionResponse } from '../types';
interface TransactionInputData {
    paymentMethod: "qris" | "cash",
    items: { menuId: number, quantity: number }[],
    userId: string
}

export const transactionService = {
    createTransaction: async (data: TransactionInputData): Promise<CreateTransactionResponse> => {
        const response = await api.post(`/transaction/transactions`, data)
        return response.data
    },

    getTransactionStatistics: async (): Promise<Stats> => {
        const response = await api.get("/transaction/transactions/statistics")
        return response.data.data
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