import { Router } from "express";
import reportRouter from "./report.routes";
import statisticRouter from "./statistic.routes";

const apiRouter = Router()

apiRouter.use('/reports', reportRouter)
apiRouter.use(statisticRouter)

export default apiRouter