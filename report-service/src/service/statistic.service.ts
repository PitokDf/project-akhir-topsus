import axios from 'axios';
import { config } from '../config';

const MENU_SERVICE_URL = config.MENU_SERVICE_URL;
const TRANSACTION_SERVICE_URL = config.TRANSACTION_SERVICE_URL;

export async function getStatistics() {
    try {
        const [menuStats, transactionStats] = await Promise.all([
            axios.get(`${MENU_SERVICE_URL}/menus/stats`),
            axios.get(`${TRANSACTION_SERVICE_URL}/transactions/stats`),
        ]);

        const { totalMenu, totalCategory } = menuStats.data.data;
        const { todayIncome, todayTransaction } = transactionStats.data.data.data;

        return {
            totalMenu,
            totalCategory,
            todayIncome: todayIncome ?? 0,
            todayTransaction: todayTransaction ?? 0,
        };
    } catch (error) {
        console.error('Error fetching statistics:', error);
        throw new Error('Failed to fetch statistics');
    }
}