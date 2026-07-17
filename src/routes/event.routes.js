import express from "express";
import { authenticate } from "../middleware/authenticate.js";
import { authorize } from "../middleware/authorize.js";
import {
  createEvent,
  updateEvent,
  submitEvent,
  getMyEvents,
  getPendingEvents,
  approveEvent,
  rejectEvent,
  getApprovedEvents,
  getEventById,
  toggleFavorite,
  bookTicket,
} from "../controllers/event.controller.js";

const router = express.Router();

// Public
router.get("/", getApprovedEvents);
router.get("/:id", getEventById);

// Customer (any authenticated user)
router.post("/:id/favorite", authenticate, toggleFavorite);
router.post("/:id/book", authenticate, bookTicket);

// Organizer only
router.post("/organizer", authenticate, authorize("organizer"), createEvent);
router.put("/organizer/:id", authenticate, authorize("organizer"), updateEvent);
router.post(
  "/organizer/:id/submit",
  authenticate,
  authorize("organizer"),
  submitEvent,
);
router.get(
  "/organizer/mine",
  authenticate,
  authorize("organizer"),
  getMyEvents,
);

// Admin only
router.get(
  "/admin/pending",
  authenticate,
  authorize("admin"),
  getPendingEvents,
);
router.post(
  "/admin/:id/approve",
  authenticate,
  authorize("admin"),
  approveEvent,
);
router.post("/admin/:id/reject", authenticate, authorize("admin"), rejectEvent);

export default router;
