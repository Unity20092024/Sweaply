import type { Metadata } from "next";
import { AuthForm } from "@/components/auth/auth-form";
import { authConfig } from "@/lib/supabase/config";
export const metadata: Metadata = {
  title: "Sign In | Sweaply",
  robots: { index: false, follow: false },
};
export default async function SignIn({
  searchParams,
}: {
  searchParams: Promise<{ notice?: string }>;
}) {
  const { notice } = await searchParams;
  return (
    <>
      <span className="eyebrow">WELCOME BACK</span>
      <h1>
        A fresh start.
        <br />
        <span>Right this way.</span>
      </h1>
      <p className="auth-intro">
        Sign in to your Sweaply account. Your home, your requests, all in one
        place.
      </p>
      {notice === "password-updated" && (
        <p className="form-notice" role="status">
          Your password is updated. Sign in with your new password.
        </p>
      )}
      {notice === "link-invalid" && (
        <p className="form-error" role="alert">
          This link has expired or couldn’t be verified. Request a new link and
          try again.
        </p>
      )}
      <AuthForm mode="sign-in" configured={!!authConfig()} />
    </>
  );
}
