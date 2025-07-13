import { Router } from 'express';
import { createCategory, getCategories, getCategoryById, updateCategory, deleteCategory } from '../controller/category.controller';
import { validateSchema } from '../middleware/zod.middleware';
import { createCategorySchema, updateCategorySchema } from '../schemas/category.schema';

const router = Router();

router.post('/',
    validateSchema(createCategorySchema),
    createCategory);
router.get('/', getCategories);
router.get('/:id', getCategoryById);
router.put('/:id', validateSchema(updateCategorySchema), updateCategory);
router.delete('/:id', deleteCategory);

export default router;