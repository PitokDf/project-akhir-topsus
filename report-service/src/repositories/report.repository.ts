import { db } from "../config/prisma";

export interface ReportDataOptions {
    startDate: Date;
    endDate: Date;
}

export const getSalesReport = async (options: ReportDataOptions) => {
    const { startDate, endDate } = options;

    const transactions = await db.transaction.findMany({
        where: {
            transactionDate: {
                gte: startDate,
                lte: endDate,
            },
        },
        include: {
            user: { select: { name: true } },
            items: {
                select: { quantity: true }
            },
        },
        orderBy: {
            transactionDate: 'desc',
        },
    });

    const topSellingItemsRaw = await db.transactionItem.groupBy({
        by: ['menuId'],
        where: {
            transaction: {
                transactionDate: {
                    gte: startDate,
                    lte: endDate,
                },
            },
        },
        _sum: {
            quantity: true,
            itemTotal: true,
        },
        orderBy: {
            _sum: {
                quantity: 'desc',
            },
        },
        take: 10,
    });

    const topMenuIds = topSellingItemsRaw.map(item => item.menuId);
    const menuDetails = await db.menu.findMany({
        where: { id: { in: topMenuIds } },
        include: { category: { select: { name: true } } },
    });
    const menuDetailsMap = new Map(menuDetails.map(menu => [menu.id, menu]));

    const topSellingProducts = topSellingItemsRaw.map((item, index) => {
        const menu = menuDetailsMap.get(item.menuId);
        return {
            rank: index + 1,
            name: menu?.name || 'Produk Dihapus',
            category: menu?.category.name || 'N/A',
            quantitySold: item._sum.quantity || 0,
            totalRevenue: item._sum.itemTotal || 0,
        };
    });

    const totalRevenue = transactions.reduce((sum, t) => sum + t.totalAmount, 0);
    const totalTransactions = transactions.length;
    const totalItemsSold = transactions.reduce((sum, t) => sum + t.items.reduce((itemSum, i) => itemSum + i.quantity, 0), 0);
    const averagePerTransaction = totalTransactions > 0 ? totalRevenue / totalTransactions : 0;

    return {
        summary: {
            totalRevenue,
            totalTransactions,
            totalItemsSold,
            averagePerTransaction,
        },
        transactions,
        topSellingProducts,
        period: {
            start: startDate,
            end: endDate,
        },
    };
};