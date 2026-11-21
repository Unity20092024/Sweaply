import "server-only";
import type { AccountSnapshot } from "./account";

// Presentation fixtures only. No user identity, credentials, session, or data writes.
export function demoSnapshot(completed: boolean): AccountSnapshot {
  return {
    name: undefined,
    quotes: [],
    bookings: completed
      ? [
          {
            id: "demo-completed-job",
            cleaner_id: "demo-cleaner",
            service: "standard",
            status: "completed",
            scheduled_for: "2026-01-01T18:00:00Z",
            completed_at: "2026-01-01T20:00:00Z",
            created_at: "2026-01-01T18:00:00Z",
          },
        ]
      : [],
    requests: [],
    cleaners: completed
      ? [
          {
            id: "demo-cleaner",
            display_name: "Demo cleaner · not a real professional",
            service_area: "Fictional fixture",
            specialties: [],
            active: false,
          },
        ]
      : [],
    favorites: [],
    messages: [],
    receipts: [],
    addresses: [],
  };
}
