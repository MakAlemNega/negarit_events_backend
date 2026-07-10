import { z } from "zod";

export const createEventSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  category: z.enum([
    "Music",
    "Tech",
    "Food & Drink",
    "Art",
    "Sports",
    "Networking",
    "Comedy",
    "Film",
    "Wellness",
    "Dance",
    "Business",
  ]),
  venue: z.object({
    name: z.string().min(1, "Venue name is required"),
    address: z.string().min(1, "Venue address is required"),
  }),
  eventDate: z
    .string()
    .datetime({ message: "eventDate must be a valid ISO date" })
    .or(z.coerce.date()),
  inviteOnly: z.boolean().optional(),
  ticketTiers: z
    .array(
      z.object({
        name: z.string().min(1),
        price: z.number().min(0),
        totalCapacity: z.number().int().min(1),
      }),
    )
    .min(1, "At least one ticket tier is required"),
});

export const rejectEventSchema = z.object({
  rejectionReason: z.string().min(3, "A rejection reason is required"),
});
