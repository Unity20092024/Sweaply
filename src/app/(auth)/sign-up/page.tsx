import type { Metadata } from "next";
import { AuthForm } from "@/components/auth/auth-form";
import { authConfig } from "@/lib/supabase/config";
export const metadata: Metadata = {
  title: "Create an Account | Sweaply",
  robots: { index: false, follow: false },
};
export default function SignUp() {
  return (
    <>
      <span className="eyebrow">A LITTLE MORE ROOM FOR YOU</span>
      <h1>
        Your fresh start
        <br />
        <span>begins here.</span>
      </h1>
      <p className="auth-intro">
        Create your customer account to keep your cleaning plans in one
        thoughtful place.
      </p>
      <AuthForm mode="sign-up" configured={!!authConfig()} />
    </>
  );
}
