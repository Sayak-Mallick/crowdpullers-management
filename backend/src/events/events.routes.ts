import express from "express";
import {
  createEvent,
  deleteEvent,
  getAllEvents,
  getSingleEvent,
  updateEvent,
} from "./events.controller";
import multer from "multer";
import path from "node:path";

const eventRouter = express.Router();

const upload = multer({
  dest: path.resolve(__dirname, "../../public/uploads/events"),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

eventRouter.get("/", getAllEvents);
eventRouter.get("/:eventId", getSingleEvent);
eventRouter.post(
  "/",
  upload.fields([{ name: "eventImage", maxCount: 1 }]),
  createEvent
);
eventRouter.patch(
  "/:eventId",
  upload.fields([{ name: "eventImage", maxCount: 1 }]),
  updateEvent
);
eventRouter.delete("/:eventId", deleteEvent);

export default eventRouter;
