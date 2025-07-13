import { Router } from "express";
import userRouter from "./user.route";
import transactionRouter from "./transaction.routes";

const apiRouter = Router()

apiRouter.use('/users', userRouter)
apiRouter.use('/transactions', transactionRouter)

export default apiRouter