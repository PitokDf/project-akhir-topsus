import api from '@/lib/axios';
import { User } from '@/lib/types';

export const userService = {
    login: async (credentials: any): Promise<any> => {
        const response = await api.post('/auth/login', credentials);
        return response.data;
    },

    register: async (userData: any): Promise<any> => {
        const response = await api.post('/auth/register', userData);
        return response.data;
    },

    getAllUsers: async (): Promise<User[]> => {
        const response = await api.get('/auth/users');
        return response.data.data;
    },

    getUserById: async (id: string): Promise<User> => {
        const response = await api.get(`/auth/users/${id}`);
        return response.data.data;
    },

    createUser: async (userData: Omit<User, 'id' | 'createdAt'>): Promise<User> => {
        const response = await api.post('/auth/users', userData);
        return response.data.data;
    },

    updateUser: async (id: string, userData: Partial<Omit<User, 'id' | 'createdAt'>>): Promise<User> => {
        const response = await api.patch(`/auth/users/${id}`, userData);
        return response.data.data;
    },

    deleteUser: async (id: string): Promise<void> => {
        await api.delete(`/auth/users/${id}`);
    },
};