import { Router } from "express";
import authRouter from "./auth.routes";
import userRouter from "./user.route";

const apiRouter = Router()

apiRouter.use('/', authRouter)
apiRouter.use('/users', userRouter)

export default apiRouter