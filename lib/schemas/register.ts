import { z } from "zod";

export const signupEmailSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Enter a valid email address"),
});

export const completeAccountSchema = z.object({
  email: z.string().email(),
  fullName: z.string().min(2, "Full name is required"),
  phone: z
    .string()
    .min(10, "Enter a valid phone number")
    .regex(/^\+\d{7,15}$/, "Use international format with country code"),
  residence: z.string().min(2, "Residence is required"),
  gender: z
    .string()
    .refine((v) => v === "male" || v === "female", "Select a gender"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Za-z]/, "Password must include a letter")
    .regex(/[0-9]/, "Password must include a number"),
});
