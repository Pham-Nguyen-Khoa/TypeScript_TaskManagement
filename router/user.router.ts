import {Router} from "express";



import * as controller from "../controller/user.controller";

import * as authMiddleware from "../middleware/authen.middleware"
const router: Router = Router();

router.post ("/register" ,controller.registerUser);

router.get ("/detail/:id" , authMiddleware.requireAuth ,controller.detail);

router.post ("/login", controller.login);


export const userRouter: Router =  router;
