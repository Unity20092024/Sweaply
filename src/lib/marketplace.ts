export const cleaningServices = [
  "Standard Cleaning",
  "Deep Cleaning",
  "Move-Out Cleaning",
] as const;
export function futureDate(value: string, now = new Date()) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const parsed = new Date(`${value}T12:00:00Z`);
  if (
    !Number.isFinite(parsed.getTime()) ||
    parsed.toISOString().slice(0, 10) !== value
  )
    return false;
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Chicago",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(now);
  const part = (type: string) => parts.find((p) => p.type === type)?.value;
  return value > `${part("year")}-${part("month")}-${part("day")}`;
}
export type DemoRequestStatus =
  "pending_cleaner_acceptance" | "accepted_awaiting_confirmation" | "declined";
export function demoDecision(
  _status: DemoRequestStatus,
  decision: "accept" | "decline",
): DemoRequestStatus {
  return decision === "accept" ? "accepted_awaiting_confirmation" : "declined";
}
