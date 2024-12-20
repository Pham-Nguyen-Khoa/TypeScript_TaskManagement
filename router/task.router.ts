import {Router} from "express";
const router: Router = Router();


import Task from "../models/task.model";

import * as controller from "../controller/task.controller";


import * as authMiddleware from "../middleware/authen.middleware"

router.use(authMiddleware.requireAuth)

router.get("/", controller.index);

router.get("/detail/:id", controller.detail );

router.patch("/change-status/:id", controller.change );

router.patch("/change-multi", controller.changeMulti );


router.post("/create", controller.create );

router.patch("/edit/:id", controller.edit );


router.delete("/delete/:id", controller.deleteTask );


export const taskRouter: Router =  router;
