import express from "express";
import {
  createClient,
  deleteClient,
  getAllClient,
  getSingleClient,
  updateClient,
} from "./client.controller";
const clientRouter = express.Router();

clientRouter.get("/", getAllClient);
clientRouter.get("/:clientId", getSingleClient);
clientRouter.post("/", createClient);
clientRouter.patch("/:clientId", updateClient);
clientRouter.delete("/:clientId", deleteClient);

export default clientRouter;
