import { z } from "zod";

export const messageSchema = z.object({
  text: z
    .string({ required_error: "Message text is required." })
    .trim()
    .min(1, "Message cannot be empty.")
    .max(200, "Message is too long (max 200 characters)."),
});

export const settingsSchema = z.object({ persistence: z.boolean() });
