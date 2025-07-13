import api from '@/lib/axios';
import { Menu, Category } from '@/lib/types';

export const menuService = {
    getAllMenus: async (): Promise<Menu[]> => {
        const response = await api.get('/menu/menus');
        return response.data.data;
    },

    getMenuById: async (id: number): Promise<Menu> => {
        const response = await api.get(`/menu/menus/${id}`);
        return response.data.data;
    },

    createMenu: async (menuData: Omit<Menu, 'id' | 'createdAt' | 'updatedAt' | 'category'> & { categoryId: number }): Promise<Menu> => {
        const response = await api.post('/menu/menus', menuData);
        return response.data.data;
    },

    updateMenu: async (id: number, menuData: Partial<Omit<Menu, 'id' | 'createdAt' | 'updatedAt' | 'category'> & { categoryId: number }>): Promise<Menu> => {
        const response = await api.put(`/menu/menus/${id}`, menuData);
        return response.data.data;
    },

    deleteMenu: async (id: number): Promise<void> => {
        await api.delete(`/menu/menus/${id}`);
    },

    toggleMenuStatus: async (id: number, isActive: boolean): Promise<Menu> => {
        const response = await api.patch(`/menu/menus/${id}/status`, { isActive });
        return response.data.data;
    },

    getAllCategories: async (): Promise<Category[]> => {
        const response = await api.get('/menu/categories');
        return response.data.data;
    },

    createCategory: async (categoryData: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>): Promise<Category> => {
        const response = await api.post('/menu/categories', categoryData);
        return response.data.data;
    },

    updateCategory: async (id: number, categoryData: Partial<Omit<Category, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Category> => {
        const response = await api.put(`/menu/categories/${id}`, categoryData);
        return response.data.data;
    },

    deleteCategory: async (id: number): Promise<void> => {
        await api.delete(`/menu/categories/${id}`);
    },
};