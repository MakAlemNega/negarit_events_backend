import { z } from "zod";

export const eventSchema = z.object({
  title: z.string().min(4, "Title must be at least 4 characters long"),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters long"),
  date: z.coerce.date().refine((date) => date >= new Date(), {
    message: "Date must be in the future",
  }),
  location: z.string().min(4, "Location must be at least 4 characters long"),
  capacity: z.number().int().positive("Capacity must be a positive integer"),
});
