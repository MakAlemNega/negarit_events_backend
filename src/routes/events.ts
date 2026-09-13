import Express = require("express");
import type { Request, Response } from "express";
import type { ParamsDictionary } from "express-serve-static-core";

import { eventSchema, updateEventSchema } from "../validations/event";
import type { EventInput } from "../validations/event";
import type { UpdateEventInput } from "../validations/event";

import { Event } from "../models/event";
import mongoose from "mongoose";

const eventRouter = Express.Router();

type ReqWithBody<T> = Request<ParamsDictionary, unknown, T>;

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
      error,
    });
  }
});

eventRouter.post("/", async (req: ReqWithBody<EventInput>, res: Response) => {
  try {
    const { title, description, date, location, capacity } = req.body;

    const validatedEvent = eventSchema.safeParse(req.body);

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
      error,
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
      error,
    });
  }
});

eventRouter.put(
  "/:id",
  async (req: ReqWithBody<UpdateEventInput>, res: Response) => {
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
        error,
      });
    }
  },
);

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
      error,
    });
  }
});

export default eventRouter;
