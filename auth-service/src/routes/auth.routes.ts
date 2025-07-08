import { Router } from "express";
import { validateSchema } from "../middleware/zod.middleware";
import { checkEmailExists } from "../validators/user.validator";
import { loginUserController, registerUserController } from "../controller/auth.controller";
import { loginUserSchema, registerUserSchema } from "../schemas/auth.schema";

const authRouter = Router()

authRouter.post(
    "/login",
    validateSchema(loginUserSchema),
    loginUserController
)

authRouter.post(
    "/register",
    validateSchema(registerUserSchema),
    checkEmailExists,
    registerUserController
)

export default authRouter