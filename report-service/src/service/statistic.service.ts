import axios from 'axios';

const MENU_SERVICE_URL = 'http://menu-service:3002/api/v1';
const TRANSACTION_SERVICE_URL = 'http://transaction-service:3003/api/v1';

export async function getStatistics() {
    try {
        const [menuStats, transactionStats] = await Promise.all([
            axios.get(`${MENU_SERVICE_URL}/menus/stats`),
            axios.get(`${TRANSACTION_SERVICE_URL}/transactions/stats`),
        ]);

        const { totalMenu, totalCategory } = menuStats.data.data;
        const { todayIncome, todayTransaction } = transactionStats.data.data;

        return {
            totalMenu,
            totalCategory,
            todayIncome,
            todayTransaction,
        };
    } catch (error) {
        // Handle error appropriately
        console.error('Error fetching statistics:', error);
        throw new Error('Failed to fetch statistics');
    }
}