import { Router } from "express";
import userRouter from "./user.route";
import transactionRouter from "./transaction.routes";
import webhookRouter from "./webhook.routes";

const apiRouter = Router()

apiRouter.use('/users', userRouter)
apiRouter.use('/transactions', transactionRouter)
apiRouter.use('/webhooks', webhookRouter)

export default apiRouter