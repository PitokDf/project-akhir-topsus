import { Router } from "express";
import userRouter from "./user.route";
import menuRouter from "./menu.routes";
import categoryRouter from "./category.routes";

const apiRouter = Router()

apiRouter.use("/menus", menuRouter);
apiRouter.use("/categories", categoryRouter);
apiRouter.use('/users', userRouter)

export default apiRouter