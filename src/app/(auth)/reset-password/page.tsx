import { redirect } from "next/navigation";
import { AuthForm } from "@/components/auth/auth-form";
import { authConfig } from "@/lib/supabase/config";
import { requireCustomer } from "@/lib/auth/session";
export const metadata = {
  title: "Choose a New Password | Sweaply",
  robots: { index: false, follow: false },
};
export default async function ResetPassword() {
  if (!authConfig()) redirect("/forgot-password");
  await requireCustomer();
  return (
    <>
      <span className="eyebrow">MAKE YOURSELF AT HOME AGAIN</span>
      <h1>
        New password.
        <br />
        <span>Same fresh feeling.</span>
      </h1>
      <p className="auth-intro">
        Choose a new password for your account. You’ll sign in again after
        saving it.
      </p>
      <AuthForm mode="reset-password" configured />
    </>
  );
}
