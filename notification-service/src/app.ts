import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import routes from './routes/index.routes';
import { AppError } from './errors/app-error';
import { HttpStatusCode } from './constants/http-status';
import { errorMiddleware } from './middleware/error.middleware';
import { NODE_ENV } from './config';

const app: Application = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());
app.use(compression());

if (NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Health check route
app.get('/health', (req: Request, res: Response) => {
    res.status(HttpStatusCode.OK).json({
        status: 'success',
        message: 'Notification service is up and running',
    });
});

// Main routes
app.use('/api/v1', routes);

// Handle 404 errors - This middleware will run if no other route matches
app.use((req: Request, res: Response, next: NextFunction) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, HttpStatusCode.NOT_FOUND));
});

// Global error handling middleware
app.use(errorMiddleware);

export default app;