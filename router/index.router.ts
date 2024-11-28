

import {Express} from "express"
import { taskRouter } from "./task.router";
import { userRouter } from "./user.router";

 const indexRouter = (app: Express): void => {

    app.use("/tasks", taskRouter);

    app.use("/users", userRouter);


};

export default indexRouter;