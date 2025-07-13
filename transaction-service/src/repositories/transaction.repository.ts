import { db as prisma } from '../config/prisma';

// Define a type for the transaction data passed from the service
type TransactionData = {
    userId: string;
    totalAmount: number;
    paymentMethod: string;
    status: string;
    items: {
        menuId: number;
        quantity: number;
        priceAtSale: number;
        itemTotal: number;
    }[];
};

export const createTransaction = async (data: TransactionData) => {
    const { userId, totalAmount, paymentMethod, items, status } = data;
    return prisma.transaction.create({
        data: {
            user: {
                connect: {
                    id: userId,
                },
            },
            totalAmount,
            paymentMethod,
            status,
            items: {
                create: items.map((item) => ({
                    menu: {
                        connect: {
                            id: item.menuId,
                        },
                    },
                    quantity: item.quantity,
                    priceAtSale: item.priceAtSale,
                    itemTotal: item.itemTotal,
                })),
            },
        },
        include: {
            items: true,
        },
    });
};

export const updateTransactionStatus = async (id: string, status: string) => {
    return prisma.transaction.update({
        where: { id: parseInt(id, 10) },
        data: { status },
    });
};

export const getTodayIncome = async (startDate: Date, endDate: Date) => {
    const result = await prisma.transaction.aggregate({
        _sum: {
            totalAmount: true,
        },
        where: {
            transactionDate: {
                gte: startDate,
                lt: endDate,
            },
            status: 'completed',
        },
    });
    return result._sum?.totalAmount || 0;
};

export const getTodayTransactionCount = async (startDate: Date, endDate: Date) => {
    return prisma.transaction.count({
        where: {
            transactionDate: {
                gte: startDate,
                lt: endDate,
            },
        },
    });
};

export const findTransactionById = async (id: string) => {
    return prisma.transaction.findUnique({
        where: { id: parseInt(id, 10) },
        include: { items: true },
    });
};

export const updateTransactionPayment = async (id: number, token: string, url: string) => {
    return prisma.transaction.update({
        where: { id },
        data: {
            paymentToken: token,
            paymentUrl: url,
        },
        include: {
            items: true,
        }
    });
};