import { db as prisma } from '../config/prisma';

type TransactionData = {
    userId: string;
    totalAmount: number;
    paymentMethod: string;
    status: string;
    items: {
        menuId: string;
        quantity: number;
        priceAtSale: number;
        itemTotal: number;
        name: string;
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
        where: { id: id },
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
            status: 'SUCCESS',
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
            status: 'SUCCESS',
        },
    });
};

export const findAll = async (options: {
    page: number;
    limit: number;
    search?: string;
    status?: string;
    paymentMethod?: string;
}) => {
    const { page, limit, search, status, paymentMethod } = options;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (search) {
        where.OR = [
            { user: { name: { contains: search, mode: 'insensitive' } } },
            { id: { equals: parseInt(search) || 0 } }
        ];
    }
    if (status) {
        where.status = status;
    }
    if (paymentMethod) {
        where.paymentMethod = paymentMethod;
    }

    const transactions = await prisma.transaction.findMany({
        where,
        skip,
        take: limit,
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                }
            },
            items: {
                include: {
                    menu: true
                }
            }
        },
        orderBy: {
            transactionDate: 'desc'
        }
    });

    const total = await prisma.transaction.count({ where });

    return {
        data: transactions,
        meta: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        },
    };
};

export const findTransactionById = async (id: string) => {
    return prisma.transaction.findUnique({
        where: { id: id },
        include: { items: true },
    });
};

export const updateTransactionPayment = async (id: string, token: string, url: string) => {
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