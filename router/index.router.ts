

import {Express} from "express"
import { taskRouter } from "./task.router";

 const indexRouter = (app: Express): void => {

    app.use("/tasks", taskRouter);


};

export default indexRouter;