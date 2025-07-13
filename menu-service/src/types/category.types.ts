import { z } from 'zod';
import { createCategorySchema, updateCategorySchema } from '../schemas/category.schema';

export type CreateCategoryInput = z.infer<typeof createCategorySchema>['body'];
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>['body'];