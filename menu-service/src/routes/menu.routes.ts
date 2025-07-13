import { Router } from 'express';
import { createMenu, getMenus, getMenuById, updateMenu, deleteMenu, uploadImage, getMenuStats } from '../controller/menu.controller';
import { validateSchema } from '../middleware/zod.middleware';
import { createMenuSchema, updateMenuSchema } from '../schemas/menu.schema';
import upload from '../middleware/upload.middleware';

const router = Router();

router.post('/upload', upload.single('image'), uploadImage);
router.post('/',
    // validateSchema(createMenuSchema),
    createMenu
);
router.get('/stats', getMenuStats);
router.get('/', getMenus);
router.get('/:id', getMenuById);
router.put('/:id',
    validateSchema(updateMenuSchema),
    updateMenu);
router.patch('/:id/status', updateMenu);
router.delete('/:id', deleteMenu);

export default router;
