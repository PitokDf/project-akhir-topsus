import { api } from '@/lib/api';
import { Category } from '@/lib/types';

class CategoryService {
    async getAllCategories(): Promise<Category[]> {
        const response = await api.get('/menu/categories');
        return response.data.data;
    }
}

export const categoryService = new CategoryService();