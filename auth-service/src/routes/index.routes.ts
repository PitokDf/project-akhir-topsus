import { Router } from "express";
import authRouter from "./auth.routes";

const apiRouter = Router()

apiRouter.use('/', authRouter)

export default apiRouter