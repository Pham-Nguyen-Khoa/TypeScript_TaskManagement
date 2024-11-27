import express, { Router,Request,Response } from "express";
const router: Router = Router();

import Task from "../models/task.model";

import * as controller from "../controller/task.controller";

router.get("/", controller.index);

router.get("/detail/:id", controller.detail );

router.patch("/change-status/:id", controller.change );


export const taskRouter: Router =  router;
