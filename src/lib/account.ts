import "server-only";
import { requireCustomer } from "@/lib/auth/session";
export const sections = [
  "overview",
  "quotes",
  "bookings",
  "cleaners",
  "favorites",
  "messages",
  "payments",
  "settings",
] as const;
export type AccountSection = (typeof sections)[number];
export type Booking = {
  id: string;
  cleaner_id: string;
  service: string;
  status: string;
  scheduled_for: string | null;
  completed_at: string | null;
  created_at: string;
};
export type Cleaner = {
  id: string;
  display_name: string;
  service_area: string;
  specialties: string[];
  active: boolean;
};
export type Quote = {
  id: string;
  service: string;
  status: string;
  estimate_cents: number | null;
  created_at: string;
};
export type CleanerRequest = {
  id: string;
  previous_booking_id: string;
  cleaner_id: string;
  preferred_date: string;
  status: string;
  created_at: string;
};
export async function loadAccount() {
  const { client, user } = await requireCustomer();
  const results = await Promise.all([
    client
      .from("customer_profiles")
      .select("display_name")
      .eq("id", user.id)
      .maybeSingle(),
    client
      .from("quotes")
      .select("id,service,status,estimate_cents,created_at")
      .eq("customer_id", user.id)
      .order("created_at", { ascending: false })
      .limit(100),
    client
      .from("bookings")
      .select(
        "id,cleaner_id,service,status,scheduled_for,completed_at,created_at",
      )
      .eq("customer_id", user.id)
      .order("created_at", { ascending: false })
      .limit(100),
    client
      .from("cleaner_requests")
      .select(
        "id,previous_booking_id,cleaner_id,preferred_date,status,created_at",
      )
      .eq("customer_id", user.id)
      .order("created_at", { ascending: false })
      .limit(100),
    client
      .from("cleaner_profiles")
      .select("id,display_name,service_area,specialties,active"),
    client
      .from("cleaner_favorites")
      .select("cleaner_id")
      .eq("customer_id", user.id)
      .order("created_at", { ascending: false })
      .limit(100),
    client
      .from("customer_messages")
      .select("id,subject,body,created_at")
      .eq("customer_id", user.id)
      .order("created_at", { ascending: false })
      .limit(100),
    client
      .from("payment_receipts")
      .select("id,booking_id,amount_cents,currency,issued_at")
      .eq("customer_id", user.id)
      .order("issued_at", { ascending: false })
      .limit(100),
    client
      .from("customer_addresses")
      .select("id,label,line1,line2,city,state,postal_code")
      .eq("customer_id", user.id)
      .order("created_at", { ascending: false })
      .limit(100),
  ]);
  if (results.some((result) => result.error))
    return { error: true as const, user };
  return {
    error: false as const,
    user,
    name: results[0].data?.display_name as string | undefined,
    quotes: results[1].data as Quote[],
    bookings: results[2].data as Booking[],
    requests: results[3].data as CleanerRequest[],
    cleaners: results[4].data as Cleaner[],
    favorites: results[5].data as { cleaner_id: string }[],
    messages: results[6].data as {
      id: string;
      subject: string;
      body: string;
      created_at: string;
    }[],
    receipts: results[7].data as {
      id: string;
      booking_id: string;
      amount_cents: number;
      currency: string;
      issued_at: string;
    }[],
    addresses: results[8].data as {
      id: string;
      label: string;
      line1: string;
      line2: string | null;
      city: string;
      state: string;
      postal_code: string;
    }[],
  };
}
export function label(value: string) {
  return (
    (
      {
        standard: "Standard Cleaning",
        deep: "Deep Cleaning",
        move_out: "Move-Out Cleaning",
        pending_cleaner_acceptance: "Pending Cleaner Acceptance",
        awaiting_confirmation: "Awaiting Confirmation",
      } as Record<string, string>
    )[value] ??
    value.replaceAll("_", " ").replace(/\b\w/g, (c) => c.toUpperCase())
  );
}
export function dateLabel(value: string | null) {
  if (!value) return "Date to be arranged";
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeZone: "America/Chicago",
  }).format(new Date(value.length === 10 ? `${value}T12:00:00Z` : value));
}
