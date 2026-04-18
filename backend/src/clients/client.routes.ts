import express from "express";
import {
  createClient,
  deleteClient,
  getAllClient,
  getSingleClient,
  updateClient,
} from "./client.controller";
import multer from "multer";
import path from "node:path";

const clientRouter = express.Router();

const upload = multer({
  dest: path.resolve(__dirname, "../../public/uploads/clients"),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

clientRouter.get("/", getAllClient);
clientRouter.get("/:clientId", getSingleClient);
clientRouter.post(
  "/",
  upload.fields([{ name: "clientLogo", maxCount: 1 }]),
  createClient
);
clientRouter.patch(
  "/:clientId",
  upload.fields([{ name: "clientLogo", maxCount: 1 }]),
  updateClient
);
clientRouter.delete("/:clientId", deleteClient);

export default clientRouter;
