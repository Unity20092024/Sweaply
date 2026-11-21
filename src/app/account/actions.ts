"use server";
import { revalidatePath } from "next/cache";
import { authConfig } from "@/lib/supabase/config";
import { requireCustomer } from "@/lib/auth/session";
import type { FormState } from "@/lib/auth/validation";
export async function requestSameCleaner(
  _state: FormState,
  form: FormData,
): Promise<FormState> {
  if (!authConfig()) return { error: "Account access is not available yet." };
  const { client } = await requireCustomer();
  const booking = String(form.get("bookingId") ?? "");
  const date = String(form.get("preferredDate") ?? "");
  if (
    !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
      booking,
    ) ||
    !/^\d{4}-\d{2}-\d{2}$/.test(date) ||
    !Number.isFinite(Date.parse(`${date}T12:00:00Z`))
  )
    return { error: "Choose a completed job and a valid preferred date." };
  // Database derives cleaner_id/customer_id and verifies ownership and completion.
  const { error } = await client.rpc("request_same_cleaner", {
    p_previous_booking_id: booking,
    p_preferred_date: date,
  });
  if (error)
    return {
      error:
        error.code === "23505"
          ? "You already requested this cleaner for that job and date."
          : "We couldn’t create this request. Choose a future date and a completed job, then try again.",
    };
  revalidatePath("/account");
  return {
    success:
      "Request sent — Pending Cleaner Acceptance. This is not a confirmed booking. Your cleaner must accept, and booking requirements must be met first.",
  };
}
export async function saveProfile(
  _state: FormState,
  form: FormData,
): Promise<FormState> {
  if (!authConfig()) return { error: "Account access is not available yet." };
  const { client, user } = await requireCustomer();
  const name = String(form.get("displayName") ?? "").trim();
  if (!name || name.length > 80)
    return { error: "Enter your name (up to 80 characters)." };
  const { data, error } = await client
    .from("customer_profiles")
    .update({ display_name: name })
    .eq("id", user.id)
    .select("id")
    .single();
  if (error || !data)
    return { error: "Your details couldn’t be saved. Please try again later." };
  revalidatePath("/account");
  return { success: "Your account details are saved." };
}
