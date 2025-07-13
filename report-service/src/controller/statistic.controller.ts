import { Request, Response } from 'express';
import { asyncHandler } from '../middleware/error.middleware';
import * as StatisticService from '../service/statistic.service';
import { ResponseUtil } from '../utils/response';

export const getStatistics = asyncHandler(async (req: Request, res: Response) => {
    const statistics = await StatisticService.getStatistics();
    return ResponseUtil.success(res, statistics);
});