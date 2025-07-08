import { HttpStatus } from "../constants/http-status"
import { asyncHandler } from "../middleware/error.middleware"
import { loginService, registerService } from "../service/auth.service"
import { ResponseUtil } from "../utils"
import { Request, Response } from "express"

export const registerUserController = asyncHandler(async (req: Request, res: Response) => {
    const payload = req.body

    const user = await registerService(payload)

    return ResponseUtil.success(res, user, HttpStatus.CREATED)
})

export const loginUserController = asyncHandler(async (req: Request, res: Response) => {
    const payload = req.body

    const token = await loginService(payload)

    return ResponseUtil.success(res, { token }, HttpStatus.OK)
})