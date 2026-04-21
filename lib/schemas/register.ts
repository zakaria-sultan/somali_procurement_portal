import { z } from "zod";

/** Any valid email (sign-in, password reset). */
export const signupEmailSchema = z.object({
  email: z
    .string()
    .min(1, "Please enter your email address.")
    .email("That doesn’t look like a valid email. Check for typos and try again."),
});

/** First step of registration: Gmail only (sends user to the registration form). */
export const registerEmailSchema = z.object({
  email: z
    .string()
    .min(1, "Please enter your Gmail address to continue.")
    .email("That doesn’t look like a valid email. Check for typos and try again.")
    .transform((s) => s.trim().toLowerCase())
    .refine(
      (e) => e.endsWith("@gmail.com") || e.endsWith("@googlemail.com"),
      "Please use a Gmail address (@gmail.com or @googlemail.com) to create an account."
    ),
});

export const signupOtpSchema = z.object({
  code: z
    .string()
    .trim()
    .length(6, "Enter all 6 digits from the email we sent you.")
    .regex(/^\d{6}$/, "The code should only contain numbers."),
});

/** Full registration form (after email step); OTP is sent after this validates. */
export const completeAccountSchema = z.object({
  email: z.string().email("Please use the same Gmail address you started with."),
  fullName: z.string().min(2, "Please enter your full name."),
  phone: z
    .string()
    .min(10, "Enter a phone number we can reach you on.")
    .regex(
      /^\+\d{7,15}$/,
      "Include your country code (for example +252 for Somalia)."
    ),
  residence: z.string().min(2, "Tell us where you live or work."),
  gender: z
    .string()
    .refine((v) => v === "male" || v === "female", "Please select male or female."),
  password: z
    .string()
    .min(8, "Use at least 8 characters for your password.")
    .regex(/[A-Za-z]/, "Add at least one letter to your password.")
    .regex(/[0-9]/, "Add at least one number to your password."),
});
