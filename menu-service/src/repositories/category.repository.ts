import { PrismaClient } from '@prisma/client';
import { CreateCategoryInput, UpdateCategoryInput } from '../types/category.types';

const prisma = new PrismaClient();

export const createCategory = async (data: CreateCategoryInput) => {
    return prisma.category.create({ data });
};

export const getCategories = async () => {
    return prisma.category.findMany({ include: { _count: { select: { menus: true } } } });
};

export const findCategoryById = async (id: number) => {
    return prisma.category.findUnique({ where: { id }, include: { menus: true } });
};

export const findCategoryByName = async (name: string) => {
    return prisma.category.findUnique({ where: { name } });
};

export const updateCategory = async (id: number, data: UpdateCategoryInput) => {
    return prisma.category.update({ where: { id }, data });
};

export const deleteCategory = async (id: number) => {
    return prisma.category.delete({ where: { id } });
};

export const countCategories = async () => {
    return prisma.category.count();
};