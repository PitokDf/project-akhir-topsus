import { NextFunction, Request, Response } from "express";
import { ZodError, ZodSchema } from "zod";
import { AppError } from "../errors/app-error";

export const validateSchema = (schema: ZodSchema) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const parsedData = schema.parse({
                body: req.body,
                params: req.params,
                query: req.query,
            });

            req.body = parsedData.body ?? req.body;
            req.params = parsedData.params ?? req.params;
            next(); // Jika validasi berhasil, lanjutkan ke middleware/controller berikutnya
        } catch (error: any) {
            if (error instanceof ZodError) {
                return next(error); // Teruskan ZodError ke middleware penanganan error
            }
            // Jika ini bukan ZodError tapi error lain yang tidak terduga dalam validasi
            next(new AppError('Kesalahan tak terduga saat validasi input.'));
        }
    };
}