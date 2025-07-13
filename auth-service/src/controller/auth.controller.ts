import path, { format } from "path"
import { HttpStatus } from "../constants/http-status"
import { asyncHandler } from "../middleware/error.middleware"
import { registerUserSchema } from "../schemas/auth.schema"
import { loginService, registerService } from "../service/auth.service"
import { ResponseUtil } from "../utils"
import { Request, Response } from "express"

export const registerUserController = asyncHandler(async (req: Request, res: Response) => {
    const validation = registerUserSchema.safeParse(req.body)

    if (!validation.success) {
        const formattedErrors = validation.error.errors.map(err => ({
            path: err.path.join('.'),
            message: err.message,
        }));
        return ResponseUtil.badRequest(res, "Invalid gagal", formattedErrors)
    }

    const user = await registerService(validation.data)

    return ResponseUtil.success(res, user, HttpStatus.CREATED)
})

export const loginUserController = asyncHandler(async (req: Request, res: Response) => {
    const payload = req.body

    const data = await loginService(payload)

    return ResponseUtil.success(res, data, HttpStatus.OK)
})