import Event from "../models/Event.js";
import {
  createEventSchema,
  rejectEventSchema,
} from "../validation/event.validation.js";

// Organizer: create a draft
export async function createEvent(req, res) {
  const parsed = createEventSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.errors[0].message });
  }

  const data = parsed.data;
  const ticketTiers = data.ticketTiers.map((tier) => ({
    ...tier,
    remainingCapacity: tier.totalCapacity, // server sets this, never the client
  }));

  const event = await Event.create({
    ...data,
    ticketTiers,
    organizerId: req.user.userId, // from the authenticate middleware, not the request body
    status: "draft",
  });

  res.status(201).json(event);
}

// Organizer: edit own draft
export async function updateEvent(req, res) {
  const event = await Event.findById(req.params.id);
  if (!event) return res.status(404).json({ error: "Event not found" });

  if (event.organizerId.toString() !== req.user.userId) {
    return res.status(403).json({ error: "You do not own this event" });
  }
  if (event.status !== "draft") {
    return res.status(400).json({ error: "Only draft events can be edited" });
  }

  const parsed = createEventSchema.partial().safeParse(req.body); // .partial() allows partial updates
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.errors[0].message });
  }

  Object.assign(event, parsed.data);
  await event.save();
  res.json(event);
}

// Organizer: submit draft for approval
export async function submitEvent(req, res) {
  const event = await Event.findById(req.params.id);
  if (!event) return res.status(404).json({ error: "Event not found" });

  if (event.organizerId.toString() !== req.user.userId) {
    return res.status(403).json({ error: "You do not own this event" });
  }
  if (event.status !== "draft") {
    return res
      .status(400)
      .json({ error: "Only draft events can be submitted" });
  }

  event.status = "pending_approval";
  await event.save();
  res.json(event);
}

// Organizer: list own events
export async function getMyEvents(req, res) {
  const events = await Event.find({ organizerId: req.user.userId }).sort({
    createdAt: -1,
  });
  res.json(events);
}

// Admin: list pending events
export async function getPendingEvents(req, res) {
  const events = await Event.find({ status: "pending_approval" }).sort({
    createdAt: 1,
  });
  res.json(events);
}

// Admin: approve
export async function approveEvent(req, res) {
  const event = await Event.findById(req.params.id);
  if (!event) return res.status(404).json({ error: "Event not found" });
  if (event.status !== "pending_approval") {
    return res
      .status(400)
      .json({ error: "Only pending events can be approved" });
  }

  event.status = "approved";
  await event.save();
  res.json(event);
}

// Admin: reject
export async function rejectEvent(req, res) {
  const parsed = rejectEventSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.errors[0].message });
  }

  const event = await Event.findById(req.params.id);
  if (!event) return res.status(404).json({ error: "Event not found" });
  if (event.status !== "pending_approval") {
    return res
      .status(400)
      .json({ error: "Only pending events can be rejected" });
  }

  event.status = "rejected";
  event.rejectionReason = parsed.data.rejectionReason;
  await event.save();
  res.json(event);
}

// Public: list approved events (basic version — search/filter comes in Milestone 3)
export async function getApprovedEvents(req, res) {
  const events = await Event.find({ status: "approved" }).sort({
    eventDate: 1,
  });
  res.json(events);
}

// Public: single event detail
export async function getEventById(req, res) {
  const event = await Event.findOne({ _id: req.params.id, status: "approved" });
  if (!event) return res.status(404).json({ error: "Event not found" });
  res.json(event);
}
