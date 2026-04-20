import express from "express";
import {
  createEvent,
  deleteEvent,
  getAllEvents,
  getSingleEvent,
  updateEvent,
} from "./events.controller";

const eventRouter = express.Router();

eventRouter.get("/", getAllEvents);
eventRouter.get("/:eventId", getSingleEvent);
eventRouter.post("/", createEvent);
eventRouter.patch("/:eventId", updateEvent);
eventRouter.delete("/:eventId", deleteEvent);

export default eventRouter;
