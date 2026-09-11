import Express = require("express");
import type { Request, Response } from "express";
import { eventSchema } from "../validations/event";
import { updateEventSchema } from "../validations/event";

import { Event } from "../models/event";
import mongoose from "mongoose";
const eventRouter = Express.Router();

eventRouter.get("/", async (_req: Request, res: Response) => {
  try {
    const events = await Event.find();
    res.status(200).json({
      message: "Events retrieved successfully",
      data: events,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving events",
      error: error,
    });
  }
});

eventRouter.post("/", async (req: Request, res: Response) => {
  try {
    const { title, description, date, location, capacity } = req.body;
    const validatedEvent = eventSchema.safeParse({
      title,
      description,
      date,
      location,
      capacity,
    });
    if (!validatedEvent.success) {
      return res.status(400).json({
        message: "Invalid event data",
        error: validatedEvent.error.flatten(),
      });
    }
    const event = new Event(validatedEvent.data);
    await event.save();
    res.status(201).json({
      message: "Event created successfully",
      data: event,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error creating event",
      error: error,
    });
  }
});

eventRouter.get("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  if (typeof id !== "string") {
    return res.status(400).json({
      message: "Invalid event ID",
    });
  }
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      message: "Invalid event ID",
    });
  }

  try {
    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).json({
        message: "Event not found",
      });
    }
    res.status(200).json({
      message: "Event retrieved successfully",
      data: event,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving event",
      error: error,
    });
  }
});

eventRouter.put("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  if (typeof id !== "string") {
    return res.status(400).json({
      message: "Invalid event ID",
    });
  }
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      message: "Invalid event ID",
    });
  }

  if (!req.body || Object.keys(req.body).length === 0) {
    return res.status(400).json({
      message: "Request body is empty",
    });
  }

  try {
    const validatedEvent = updateEventSchema.safeParse(req.body);
    if (!validatedEvent.success) {
      return res.status(400).json({
        message: "Invalid event data",
        error: validatedEvent.error.flatten(),
      });
    }
    const event = await Event.findByIdAndUpdate(id, validatedEvent.data, {
      new: true,
    });
    if (!event) {
      return res.status(404).json({
        message: "Event not found",
      });
    }
    res.status(200).json({
      message: "Event updated successfully",
      data: event,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating event",
      error: error,
    });
  }
});

eventRouter.delete("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  if (typeof id !== "string") {
    return res.status(400).json({
      message: "Invalid event ID",
    });
  }
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      message: "Invalid event ID",
    });
  }
  try {
    const event = await Event.findByIdAndDelete(id);
    if (!event) {
      return res.status(404).json({
        message: "Event not found",
      });
    }
    res.status(200).json({
      message: "Event deleted successfully",
      data: event,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting event",
      error: error,
    });
  }
});

module.exports = eventRouter;
