"use client";
import { useActionState } from "react";
import { ArrowRight, CalendarDays } from "lucide-react";
import { requestSameCleaner, saveProfile } from "@/app/account/actions";
import type { FormState } from "@/lib/auth/validation";
export function RepeatCleanerForm({
  bookingId,
  cleanerName,
}: {
  bookingId: string;
  cleanerName: string;
}) {
  const [state, action, pending] = useActionState(
    requestSameCleaner,
    {} as FormState,
  );
  const [year, month, day] = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Chicago",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  })
    .formatToParts(new Date())
    .filter((p) => ["year", "month", "day"].includes(p.type))
    .sort(
      (a, b) =>
        ["year", "month", "day"].indexOf(a.type) -
        ["year", "month", "day"].indexOf(b.type),
    )
    .map((p) => p.value);
  const tomorrow = new Date(
    Date.UTC(Number(year), Number(month) - 1, Number(day) + 1),
  )
    .toISOString()
    .slice(0, 10);
  return (
    <details className="repeat-cleaner">
      <summary>
        Request Same Cleaner <ArrowRight size={15} />
      </summary>
      <form action={action}>
        <p>
          Request <strong>{cleanerName}</strong> again for this completed job.
        </p>
        <input type="hidden" name="bookingId" value={bookingId} />
        <label htmlFor={`date-${bookingId}`}>
          <CalendarDays size={15} /> Preferred date
        </label>
        <input
          id={`date-${bookingId}`}
          name="preferredDate"
          type="date"
          required
          min={tomorrow}
        />
        <p className="account-fine">
          A preferred date is a request, not a guarantee of availability. Your
          cleaner must accept before booking requirements can be completed.
        </p>
        {state.error && (
          <p className="account-error" role="alert">
            {state.error}
          </p>
        )}
        {state.success && (
          <p className="account-notice" role="status">
            {state.success}
          </p>
        )}
        <button
          className="button button-primary"
          disabled={pending || !!state.success}
        >
          {pending ? "Sending…" : "Request This Cleaner"}
          <ArrowRight size={16} />
        </button>
      </form>
    </details>
  );
}
export function ProfileForm({ name }: { name: string }) {
  const [state, action, pending] = useActionState(saveProfile, {} as FormState);
  return (
    <form action={action} className="profile-settings">
      <label htmlFor="displayName">Your name</label>
      <input
        name="displayName"
        id="displayName"
        defaultValue={name}
        autoComplete="name"
        required
        maxLength={80}
      />
      {state.error && (
        <p className="account-error" role="alert">
          {state.error}
        </p>
      )}
      {state.success && (
        <p role="status" className="account-notice">
          {state.success}
        </p>
      )}
      <button className="button button-primary" disabled={pending}>
        {pending ? "Saving…" : "Save Details"}
        <ArrowRight size={16} />
      </button>
    </form>
  );
}
