import { Router } from "express";
import userRouter from "./user.route";
import reportRouter from "./report.routes";
import statisticRouter from "./statistic.routes";

const apiRouter = Router()

apiRouter.use('/users', userRouter)
apiRouter.use('/reports', reportRouter)
apiRouter.use(statisticRouter)

export default apiRouter