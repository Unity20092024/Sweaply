"use server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { authConfig } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";
import {
  validateAuth,
  type AuthMode,
  type FormState,
} from "@/lib/auth/validation";

export async function authenticate(
  mode: AuthMode,
  _previous: FormState,
  form: FormData,
): Promise<FormState> {
  if (
    !["sign-in", "sign-up", "forgot-password", "reset-password"].includes(mode)
  )
    return { error: "This action isn’t available." };
  const validation = validateAuth(mode, form);
  if (validation.error) return validation;
  const config = authConfig();
  if (!config)
    return {
      error: "Account access is being prepared. Please try again later.",
    };
  const email = String(form.get("email") ?? "").trim();
  const password = String(form.get("password") ?? "");
  let destination: string | undefined;
  try {
    const client = await createClient();
    if (mode === "sign-in") {
      const { data, error } = await client.auth.signInWithPassword({
        email,
        password,
      });
      if (error || !data.user || data.user.is_anonymous)
        return {
          error:
            "We couldn’t sign you in. Check your details and verify your email if needed.",
        };
      destination = "/account";
    } else if (mode === "sign-up") {
      const { data, error } = await client.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${config.site}/auth/callback`,
          data: { display_name: String(form.get("name")).trim() },
        },
      });
      if (error)
        return {
          error:
            "We couldn’t create your account. Try again later, or sign in if you already have an account.",
        };
      if (data.session) destination = "/account";
      else
        return {
          success:
            "Check your email for the next step. If verification is required, follow the link to finish creating your account.",
        };
    } else if (mode === "forgot-password") {
      const { error } = await client.auth.resetPasswordForEmail(email, {
        redirectTo: `${config.site}/auth/callback?next=/reset-password`,
      });
      // Identical result for known/unknown addresses and provider responses to avoid enumeration.
      if (error)
        console.warn(
          "Password reset request was not accepted by the auth provider.",
        );
      return {
        success:
          "If an account exists for this email, you’ll receive a password reset link. Check your inbox and spam folder.",
      };
    } else {
      const verified = client;
      const { data: identity, error: identityError } =
        await verified.auth.getUser();
      if (identityError || !identity.user || identity.user.is_anonymous)
        return {
          error:
            "Your reset session has expired. Request a new password reset link.",
        };
      const { error } = await verified.auth.updateUser({ password });
      if (error)
        return {
          error:
            "We couldn’t update your password. Request a new reset link and try again.",
        };
      // End the reset session. The new password is used on a fresh sign-in.
      const { error: signOutError } = await verified.auth.signOut({
        scope: "global",
      });
      if (signOutError)
        return {
          error:
            "Your password changed, but session sign-out could not be completed. Try signing out again.",
        };
      destination = "/sign-in?notice=password-updated";
    }
  } catch {
    return {
      error: "We couldn’t connect right now. Please try again shortly.",
    };
  }
  if (destination) {
    revalidatePath("/account", "layout");
    redirect(destination);
  }
  return {};
}
export async function signOut(): Promise<void> {
  if (!authConfig()) redirect("/sign-in");
  const client = await createClient();
  const { error } = await client.auth.signOut({ scope: "global" });
  if (error) redirect("/account?notice=sign-out-failed");
  revalidatePath("/account", "layout");
  redirect("/sign-in");
}
