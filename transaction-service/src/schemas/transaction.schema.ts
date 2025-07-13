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

export const updateTransactionStatusSchema = z.object({
    status: z.enum([
        'PENDING',
        'SUCCESS',
        'CANCELLED',
        'FAILED',
        'EXPIRED',
    ]),
});

export type UpdateTransactionStatusInput = z.infer<typeof updateTransactionStatusSchema>;