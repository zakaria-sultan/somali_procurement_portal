import { SignUpForm } from "@/components/auth/sign-up-form";
import { isGoogleOAuthConfigured } from "@/lib/google-oauth-env";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create an account",
  robots: { index: false, follow: false },
};

export default function SignUpPage() {
  const googleAuth = isGoogleOAuthConfigured();

  return (
    <Card className="w-full max-w-md shadow-md">
      <CardHeader className="text-center">
        <CardTitle className="text-xl">Create an Account</CardTitle>
        <CardDescription>
          Get alerts for tenders and marketplace opportunities.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <SignUpForm googleAuth={googleAuth} />
      </CardContent>
    </Card>
  );
}
