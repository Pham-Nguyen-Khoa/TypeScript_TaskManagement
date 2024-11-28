"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const task_router_1 = require("./task.router");
const user_router_1 = require("./user.router");
const indexRouter = (app) => {
    app.use("/tasks", task_router_1.taskRouter);
    app.use("/users", user_router_1.userRouter);
};
exports.default = indexRouter;
