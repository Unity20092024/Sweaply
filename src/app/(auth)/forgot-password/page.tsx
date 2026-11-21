import { AuthForm } from "@/components/auth/auth-form";
import { authConfig } from "@/lib/supabase/config";
export const metadata = {
  title: "Reset Your Password | Sweaply",
  robots: { index: false, follow: false },
};
export default function ForgotPassword() {
  return (
    <>
      <span className="eyebrow">LET’S GET YOU BACK IN</span>
      <h1>
        A little reset.
        <br />
        <span>A fresh start.</span>
      </h1>
      <p className="auth-intro">
        Enter your email and we’ll send instructions to reset your password, if
        you have an account.
      </p>
      <AuthForm mode="forgot-password" configured={!!authConfig()} />
    </>
  );
}
