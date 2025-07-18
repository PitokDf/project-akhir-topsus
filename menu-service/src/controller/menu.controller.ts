import { Request, Response } from 'express';
import * as MenuService from '../service/menu.service';
import { CreateMenuInput, UpdateMenuInput } from '../types/menu.types';
import { asyncHandler } from '../middleware/error.middleware';
import { ResponseUtil } from '../utils/response';

export const createMenu = asyncHandler(async (req: Request<{}, {}, CreateMenuInput>, res: Response) => {
    const menu = await MenuService.createMenu(req.body);
    return ResponseUtil.success(res, menu, 201);
});

export const getMenus = asyncHandler(async (req: Request, res: Response) => {
    const menus = await MenuService.getMenus();
    return ResponseUtil.success(res, menus);
});

export const getMenuById = asyncHandler(async (req: Request<{ id: string }>, res: Response) => {
    const menu = await MenuService.getMenuById(req.params.id);
    return ResponseUtil.success(res, menu);
});

export const updateMenu = asyncHandler(async (req: Request<{ id: string }, {}, UpdateMenuInput>, res: Response) => {
    const menu = await MenuService.updateMenu(req.params.id, req.body);
    return ResponseUtil.success(res, menu);
});

export const deleteMenu = asyncHandler(async (req: Request<{ id: string }>, res: Response) => {
    await MenuService.deleteMenu(req.params.id);
    return ResponseUtil.success(res, null, 204);
});

export const uploadImage = asyncHandler(async (req: Request, res: Response) => {
    if (!req.file) {
        return res.status(400).send({ message: 'Please upload a file' });
    }

    const url = `http://api.cafe.com/uploads/${req.file.filename}`;
    return ResponseUtil.success(res, { url });
});

export const getMenuStats = asyncHandler(async (req: Request, res: Response) => {
    const stats = await MenuService.getMenuStats();
    return ResponseUtil.success(res, stats);
});
