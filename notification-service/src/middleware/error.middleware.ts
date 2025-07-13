import { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors/app-error';
import { logger } from '../utils/winston.logger';
import { HttpStatusCode } from '../constants/http-status';

export const errorMiddleware = (err: Error, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof AppError) {
        logger.error(`[${err.statusCode}] - ${err.message}`);
        return res.status(err.statusCode).json({
            status: 'error',
            message: err.message,
        });
    }

    logger.error(`[500] - ${err.message}`);
    return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
        status: 'error',
        message: 'An unexpected error occurred',
    });
};