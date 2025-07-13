import { z } from 'zod';

export const createTransactionItemSchema = z.object({
    menuId: z.number(),
    quantity: z.number().min(1),
});

export const createTransactionSchema = z.object({
    paymentMethod: z.string(),
    items: z.array(createTransactionItemSchema).min(1),
    userId: z.string(),
});

export type CreateTransactionInput = z.infer<typeof createTransactionSchema>;