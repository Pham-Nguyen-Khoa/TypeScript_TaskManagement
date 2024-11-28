// const express = require('express')
import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import * as database from "./config/database";
import cors from "cors";


//Import Router
import indexRouter from "./router/index.router";

dotenv.config();




database.connect();
const app: Express = express();
const port: String | Number = process.env.PORT || 4000;

app.use(express.json());
indexRouter(app);



app.use(cors());


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
