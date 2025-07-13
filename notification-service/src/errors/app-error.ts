import { HttpStatusCode } from "../constants/http-status";

export class AppError extends Error {
    public readonly statusCode: HttpStatusCode;
    public readonly isOperational: boolean;

    constructor(message: string, statusCode: HttpStatusCode, isOperational = true) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = isOperational;

        Object.setPrototypeOf(this, new.target.prototype);
        Error.captureStackTrace(this, this.constructor);
    }
}