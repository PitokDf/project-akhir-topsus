import { db } from "../config/prisma";
import { Menu } from "@prisma/client";

export interface ReportDataOptions {
    startDate: Date;
    endDate: Date;
}

type MenuDetail = Pick<Menu, 'id' | 'name'> & {
    category: { name: string; } | null;
};

export const getSalesReport = async (options: ReportDataOptions) => {
    const { startDate, endDate } = options;

    const transactions = await db.transaction.findMany({
        where: {
            transactionDate: {
                gte: startDate,
                lte: endDate,
            },
            status: 'SUCCESS',
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
                status: 'SUCCESS',
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

    const topMenuIds = topSellingItemsRaw.map((item) => item.menuId);

    const menuDetails: MenuDetail[] = await db.menu.findMany({
        where: { id: { in: topMenuIds } },
        select: {
            id: true,
            name: true,
            category: {
                select: {
                    name: true
                }
            }
        }
    });

    const menuDetailsMap = new Map(
        menuDetails.map((menu) => [menu.id, menu])
    );

    const topSellingProducts = topSellingItemsRaw.map((item, index) => {
        const menu = menuDetailsMap.get(item.menuId);
        return {
            rank: index + 1,
            name: menu?.name ?? 'Produk Dihapus',
            category: menu?.category?.name ?? 'N/A',
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