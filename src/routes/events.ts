import Express = require("express");
import type { Request, Response } from "express";

const Event = require("../models/event");
const eventRouter = Express.Router();

eventRouter.get("/", async (_req: Request, res: Response) => {
  const events = await Event.find();
  res.status(200).json({
    message: "Events retrieved successfully",
    data: events,
  });
});

eventRouter.post("/", async (req: Request, res: Response) => {
  const { title, description, date, location, capacity } = req.body;
  const event = new Event({ title, description, date, location, capacity });
  await event.save();
  res.status(201).json({
    message: "Event created successfully",
    data: event,
  });
});

eventRouter.get("/:id", async (req: Request, res: Response) => {
  const event = await Event.findById(req.params.id);
  if (!event) {
    return res.status(404).json({
      message: "Event not found",
    });
  }
  res.status(200).json({
    message: "Event retrieved successfully",
    data: event,
  });
});

eventRouter.put("/:id", async (req: Request, res: Response) => {
  const { title, description, date, location, capacity } = req.body;
  const event = await Event.findByIdAndUpdate(
    req.params.id,
    { title, description, date, location, capacity },
    { new: true }
    );
  if (!event) {
    return res.status(404).json({
      message: "Event not found",
    });
  }
  res.status(200).json({
    message: "Event updated successfully",
    data: event,
  });
});

module.exports = eventRouter;
