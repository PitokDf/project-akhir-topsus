import { AppError } from '../errors/app-error';
import * as CategoryRepository from '../repositories/category.repository';
import { CreateCategoryInput, UpdateCategoryInput } from '../types/category.types';
import redisClient from '../config/redis';

const CATEGORIES_CACHE_KEY = 'categories';
const CATEGORY_CACHE_KEY = 'category';

export const createCategory = async (data: CreateCategoryInput) => {
    const existingCategory = await CategoryRepository.findCategoryByName(data.name);
    if (existingCategory) {
        throw new AppError('Category with this name already exists', 409);
    }
    const newCategory = await CategoryRepository.createCategory(data);
    await redisClient.del(CATEGORIES_CACHE_KEY);
    return newCategory;
};

export const getCategories = async () => {
    const cachedCategories = await redisClient.get(CATEGORIES_CACHE_KEY);
    if (cachedCategories) {
        return JSON.parse(cachedCategories);
    }

    const categories = await CategoryRepository.getCategories();
    await redisClient.set(CATEGORIES_CACHE_KEY, JSON.stringify(categories), {
        EX: 3600, // Cache for 1 hour
    });
    return categories;
};

export const getCategoryById = async (id: number) => {
    const cacheKey = `${CATEGORY_CACHE_KEY}:${id}`;
    const cachedCategory = await redisClient.get(cacheKey);
    if (cachedCategory) {
        return JSON.parse(cachedCategory);
    }

    const category = await CategoryRepository.findCategoryById(id);
    if (!category) {
        throw new AppError('Category not found', 404);
    }

    await redisClient.set(cacheKey, JSON.stringify(category), {
        EX: 3600, // Cache for 1 hour
    });
    return category;
};

export const updateCategory = async (id: number, data: UpdateCategoryInput) => {
    const category = await CategoryRepository.findCategoryById(id);
    if (!category) {
        throw new AppError('Category not found', 404);
    }

    const updatedCategory = await CategoryRepository.updateCategory(id, data);
    await redisClient.del(CATEGORIES_CACHE_KEY);
    await redisClient.del(`${CATEGORY_CACHE_KEY}:${id}`);
    return updatedCategory;
};

export const deleteCategory = async (id: number) => {
    const category = await CategoryRepository.findCategoryById(id);
    if (!category) {
        throw new AppError('Category not found', 404);
    }

    // Periksa apakah ada menu yang terkait dengan kategori ini
    if (category.menus && category.menus.length > 0) {
        throw new AppError('Cannot delete category because it has associated menus. Please delete the menus first.', 400);
    }

    await CategoryRepository.deleteCategory(id);
    await redisClient.del(CATEGORIES_CACHE_KEY);
    await redisClient.del(`${CATEGORY_CACHE_KEY}:${id}`);
};