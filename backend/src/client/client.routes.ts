import express from "express";
import { creatClient, getClients } from "./client.controller";
import multer from "multer";
import path from "node:path";

const clientRouter = express.Router();
const upload = multer({
  dest: path.resolve(__dirname, "../../public/uploads/clients"),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

clientRouter.get("/", getClients);
clientRouter.post(
  "/",
  upload.fields([{ name: "clientLogo", maxCount: 1 }]),
  creatClient,
);

export default clientRouter;
