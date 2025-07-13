import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getSalesReport = async () => {
    const salesReport = await prisma.transaction.findMany({
        include: {
            items: {
                include: {
                    menu: true,
                },
            },
            user: true,
        },
    });

    const totalSales = salesReport.reduce((acc: number, transaction: { totalAmount: number }) => acc + transaction.totalAmount, 0);
    const totalTransactions = salesReport.length;

    return {
        salesReport,
        summary: {
            totalSales,
            totalTransactions,
        },
    };
};