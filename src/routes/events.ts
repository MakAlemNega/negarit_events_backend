import Express = require("express");
import type { Request, Response } from "express";

import { eventSchema, updateEventSchema } from "../validations/event";
import type {
  EventInput,
  UpdateEventInput,
} from "../validations/event";

import { Event } from "../models/event";
import mongoose from "mongoose";

const eventRouter = Express.Router();

/*
  Reusable request types

  POST:
  - No URL parameters
  - Request body is EventInput

  PUT:
  - URL contains :id
  - Request body is UpdateEventInput
*/
type EventRequest = Request<{}, unknown, EventInput>;

type UpdateEventRequest = Request<
  { id: string },
  unknown,
  UpdateEventInput
>;

/*
  GET /api/events

  Retrieve all events.
*/
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

/*
  POST /api/events

  Create a new event.
*/
eventRouter.post(
  "/",
  async (req: EventRequest, res: Response) => {
    try {
      /*
        Zod validates the actual runtime request body.

        EventInput gives TypeScript a compile-time
        understanding of what the body should contain.
      */
      const validatedEvent = eventSchema.safeParse(req.body);

      if (!validatedEvent.success) {
        return res.status(400).json({
          message: "Invalid event data",
          error: validatedEvent.error.flatten(),
        });
      }

      /*
        validatedEvent.data is now the validated Zod result.

        Because eventSchema uses z.coerce.date(),
        date is a real Date here.
      */
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
  },
);

/*
  GET /api/events/:id

  Retrieve one event by MongoDB ObjectId.
*/
eventRouter.get(
  "/:id",
  async (
    req: Request<{ id: string }>,
    res: Response,
  ) => {
    const { id } = req.params;

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
  },
);

/*
  PUT /api/events/:id

  Update one or more fields of an existing event.
*/
eventRouter.put(
  "/:id",
  async (
    req: UpdateEventRequest,
    res: Response,
  ) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid event ID",
      });
    }

    if (Object.keys(req.body).length === 0) {
      return res.status(400).json({
        message: "Request body is empty",
      });
    }

    try {
      /*
        updateEventSchema is eventSchema.partial(),
        so the client can send only the fields
        that need to change.
      */
      const validatedEvent = updateEventSchema.safeParse(req.body);

      if (!validatedEvent.success) {
        return res.status(400).json({
          message: "Invalid event data",
          error: validatedEvent.error.flatten(),
        });
      }

      const event = await Event.findByIdAndUpdate(
        id,
        validatedEvent.data,
        {
          new: true,
        },
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
    } catch (error) {
      res.status(500).json({
        message: "Error updating event",
        error,
      });
    }
  },
);

/*
  DELETE /api/events/:id

  Delete an existing event.
*/
eventRouter.delete(
  "/:id",
  async (
    req: Request<{ id: string }>,
    res: Response,
  ) => {
    const { id } = req.params;

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
  },
);

export default eventRouter;
