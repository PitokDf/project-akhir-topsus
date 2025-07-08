import { NextFunction, Request, Response } from "express";
import { AppError } from "../errors/app-error";
import { HttpStatus } from "../constants/http-status";
import { UserRepository } from "../repositories/user.repository";

export const checkEmailExists = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { email } = req.body
    const userId = req.params.userId
    if (!email) return next();

    const existingUser = await UserRepository.findByEmail(email)

    if (existingUser) throw new AppError("Email sudah terdaftar", HttpStatus.BAD_REQUEST);

    return next()
}