import { PrismaClient } from '@prisma/client';
import { CreateMenuInput, UpdateMenuInput } from '../types/menu.types';

const prisma = new PrismaClient();

export const createMenu = async (data: CreateMenuInput) => {
    return prisma.menu.create({ data, include: { category: { select: { name: true, id: true } } } });
};

export const getMenus = async () => {
    return prisma.menu.findMany({ include: { category: true } });
};

export const findMenuById = async (id: number) => {
    return prisma.menu.findUnique({ where: { id }, include: { category: true } });
};

export const findMenuByName = async (name: string) => {
    return prisma.menu.findUnique({ where: { name } });
};

export const updateMenu = async (id: number, data: UpdateMenuInput) => {
    return prisma.menu.update({ where: { id }, data, include: { category: { select: { name: true, id: true } } } });
};

export const deleteMenu = async (id: number) => {
    return prisma.$transaction(async (prisma) => {
        // Hapus semua transaction_items yang mereferensikan menu ini
        await prisma.transactionItem.deleteMany({
            where: {
                menuId: id,
            },
        });

        // Kemudian hapus menu itu sendiri
        return prisma.menu.delete({ where: { id } });
    });
};

export const countMenus = async () => {
    return prisma.menu.count();
};
