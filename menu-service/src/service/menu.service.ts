import { AppError } from '../errors/app-error';
import * as MenuRepository from '../repositories/menu.repository';
import * as CategoryRepository from '../repositories/category.repository';
import { CreateMenuInput, UpdateMenuInput } from '../types/menu.types';
import redisClient from '../config/redis';

const MENUS_CACHE_KEY = 'menus';
const MENU_CACHE_KEY = 'menu';

export const createMenu = async (data: CreateMenuInput) => {
    const existingMenu = await MenuRepository.findMenuByName(data.name);
    if (existingMenu) {
        throw new AppError('Menu with this name already exists', 409);
    }

    const category = await CategoryRepository.findCategoryById(data.categoryId);
    if (!category) {
        throw new AppError('Category not found', 404);
    }

    const newMenu = await MenuRepository.createMenu(data);
    await redisClient.del(MENUS_CACHE_KEY);
    return newMenu;
};

export const getMenus = async () => {
    const cachedMenus = await redisClient.get(MENUS_CACHE_KEY);
    if (cachedMenus) {
        return JSON.parse(cachedMenus);
    }

    const menus = await MenuRepository.getMenus();
    await redisClient.set(MENUS_CACHE_KEY, JSON.stringify(menus), {
        EX: 3600,
    });
    return menus;
};

export const getMenuById = async (id: number) => {
    const cacheKey = `${MENU_CACHE_KEY}:${id}`;
    const cachedMenu = await redisClient.get(cacheKey);
    if (cachedMenu) {
        return JSON.parse(cachedMenu);
    }

    const menu = await MenuRepository.findMenuById(id);
    if (!menu) {
        throw new AppError('Menu not found', 404);
    }

    await redisClient.set(cacheKey, JSON.stringify(menu), {
        EX: 3600, // Cache for 1 hour
    });
    return menu;
};

export const updateMenu = async (id: number, data: UpdateMenuInput) => {
    const menu = await MenuRepository.findMenuById(id);
    if (!menu) {
        throw new AppError('Menu not found', 404);
    }

    if (data.categoryId) {
        const category = await CategoryRepository.findCategoryById(data.categoryId);
        if (!category) {
            throw new AppError('Category not found', 404);
        }
    }

    const updatedMenu = await MenuRepository.updateMenu(id, data);
    await redisClient.del(MENUS_CACHE_KEY);
    await redisClient.del(`${MENU_CACHE_KEY}:${id}`);
    return updatedMenu;
};

export const deleteMenu = async (id: number) => {
    const menu = await MenuRepository.findMenuById(id);
    if (!menu) {
        throw new AppError('Menu not found', 404);
    }

    console.log(id, menu);


    await MenuRepository.deleteMenu(id);
    await redisClient.del(MENUS_CACHE_KEY);
    await redisClient.del(`${MENU_CACHE_KEY}:${id}`);
};

export const getMenuStats = async () => {
    const totalMenu = await MenuRepository.countMenus();
    const totalCategory = await CategoryRepository.countCategories();
    return { totalMenu, totalCategory };
};
