import { Request, Response } from 'express';
import * as CategoryService from '../service/category.service';
import { asyncHandler } from '../middleware/error.middleware';
import { ResponseUtil } from '../utils/response';

export const createCategory = asyncHandler(async (req: Request, res: Response) => {
    const category = await CategoryService.createCategory(req.body);
    return ResponseUtil.success(res, category, 201);
});

export const getCategories = asyncHandler(async (req: Request, res: Response) => {
    const categories = await CategoryService.getCategories();
    return ResponseUtil.success(res, categories);
});

export const getCategoryById = asyncHandler(async (req: Request<{ id: string }>, res: Response) => {
    const category = await CategoryService.getCategoryById(parseInt(req.params.id, 10));
    return ResponseUtil.success(res, category);
});

export const updateCategory = asyncHandler(async (req: Request, res: Response) => {
    const category = await CategoryService.updateCategory(parseInt(req.params.id, 10), req.body);
    return ResponseUtil.success(res, category);
});

export const deleteCategory = asyncHandler(async (req: Request<{ id: string }>, res: Response) => {
    await CategoryService.deleteCategory(parseInt(req.params.id, 10));
    return ResponseUtil.success(res, null, 204);
});