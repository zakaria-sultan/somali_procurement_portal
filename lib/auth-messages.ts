/** User-facing copy for auth flows — clear, calm English; no raw errors or stack traces. */

export const AUTH_MESSAGES = {
  emailPasswordRequired:
    "Please enter both your email address and your password so we can sign you in.",
  invalidEmail:
    "That doesn’t look like a valid email address. Please check for typos and try again.",
  signInFailed:
    "We couldn’t sign you in with those details. Double-check your email and password, then try again. If you usually sign in with Google, use that button instead.",
  accountExists:
    "An account with this email already exists. Sign in below, or use “Continue with Google” if you registered that way.",
  otpSent:
    "We’ve sent a 6-digit verification code to your inbox. Enter it on the next screen to continue. The code expires in 15 minutes.",
  otpSentDev:
    "Email isn’t configured for this environment. Your verification code was printed in the **server terminal** (where `npm run dev` is running). Enter it below to continue.",
  emailNotConfigured:
    "We can’t send email from this server yet. Ask your administrator to set SMTP variables (see project docs), then try again.",
  otpInvalid:
    "That code doesn’t match or has expired. Please check the numbers carefully, or go back and request a new code.",
  otpLocked:
    "Too many incorrect attempts. Please wait a few minutes or start again from the registration page.",
  verifyFirst:
    "Please verify your email with the code we sent before completing your profile.",
  completeAccountSuccess:
    "Your account is ready. Sign in with your email and password to continue.",
  profileSaveFailed:
    "Something went wrong while saving your profile. Please try again in a moment.",
  resetGeneric:
    "If we find an account for that email address, we’ll send password reset instructions shortly. If you don’t see anything, check your spam folder or confirm the address you used to register.",
  resetInvalidEmail:
    "Please enter the email address you used when you created your account.",
} as const;
