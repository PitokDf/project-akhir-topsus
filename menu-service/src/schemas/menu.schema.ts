import { z } from 'zod';

export const createMenuSchema = z.object({
    body: z.object({
        name: z.string({ required_error: 'Name is required' }),
        description: z.string().optional(),
        price: z.number({ required_error: 'Price is required' }).positive(),
        categoryId: z.number({ required_error: 'Category ID is required' }).int(),
        imageUrl: z.string().url().optional().or(z.literal('')),
        isActive: z.boolean().optional(),
    }),
});

export const updateMenuSchema = z.object({
    body: z.object({
        name: z.string().optional(),
        description: z.string().optional(),
        price: z.number().positive().optional(),
        categoryId: z.number().int().optional(),
        imageUrl: z.string().url().optional().or(z.literal('')),
        isActive: z.boolean().optional(),
    }),
    params: z.object({
        id: z.string(),
    }),
});

