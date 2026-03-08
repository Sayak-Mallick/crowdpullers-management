import express from "express";
import { creatClient } from "./client.controller";

const clientRouter = express.Router();

clientRouter.post("/", creatClient);

export default clientRouter;
