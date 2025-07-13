import { z } from 'zod';
import { createMenuSchema, updateMenuSchema } from '../schemas/menu.schema';

export type CreateMenuInput = z.infer<typeof createMenuSchema>['body'];
export type UpdateMenuInput = z.infer<typeof updateMenuSchema>['body'];
