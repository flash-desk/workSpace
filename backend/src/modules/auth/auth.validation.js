import { z } from "zod";

export const registerSchema = z.object({
  firstName: z.string().trim().min(2),
  lastName: z.string().trim().min(2),
  phone: z.string().trim().optional(),
  email: z.string().trim().email(),
  password: z.string().min(8),
});

export const googleAuthSchema = z.object({
  idToken: z
    .string({ required_error: "Google ID token is required" })
    .trim()
    .min(1),
});