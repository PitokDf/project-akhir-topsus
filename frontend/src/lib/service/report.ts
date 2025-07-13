import api from '@/lib/axios';
import { Stats } from '../types';
interface DateRange {
    start: Date;
    end: Date;
}

export const reportService = {
    getSales: async ({ start, end }: DateRange): Promise<any> => {
        const startDate = start.toISOString().split('T')[0];
        const endDate = end.toISOString().split('T')[0];
        const response = await api.get(`/report/reports/sales?start${startDate}&end=${endDate}`)
        return response.data.data
    },

    getStatistics: async (): Promise<Stats> => {
        const response = await api.get("/report/statistics")
        return response.data.data
    },

    downloadSalesReport: async ({ start, end }: DateRange) => {
        const startDate = start.toISOString().split('T')[0];
        const endDate = end.toISOString().split('T')[0];
        const response = await api.get(
            `/report/reports/sales/download?start=${startDate}&end=${endDate}`,
            { responseType: "blob" }
        );

        return response
    },
};