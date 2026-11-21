"use client";
import { useState, useRef } from "react";
import { ArrowRight } from "lucide-react";

/** UI only: intentionally imports no auth actions, clients, or database helpers. */
export function RepeatCleanerPreview() {
  const [message, setMessage] = useState("");
  const dateInput = useRef<HTMLInputElement>(null);
  return (
    <details className="repeat-cleaner">
      <summary>
        Request Same Cleaner · UI preview <ArrowRight size={15} />
      </summary>
      <div className="repeat-preview-fields">
        <p>
          This fictional completed-job fixture demonstrates the preferred-date
          control. No cleaner or availability is real.
        </p>
        <label htmlFor="demo-preferred-date">
          Preferred date · demonstration only
        </label>
        <input
          ref={dateInput}
          id="demo-preferred-date"
          name="preferredDate"
          type="date"
          required
        />
        <p className="account-fine">
          No booking, account, session, or database connection exists in this
          preview.
        </p>
        <button
          className="button button-outline"
          type="button"
          onClick={() => {
            if (!dateInput.current?.reportValidity()) return;
            setMessage(
              "Preview only — no request was sent or saved. A real request would begin in Pending Cleaner Acceptance, not as a confirmed booking.",
            );
          }}
        >
          Preview request behavior <ArrowRight size={16} />
        </button>
        {message && (
          <p className="account-notice" role="status">
            {message}
          </p>
        )}
      </div>
    </details>
  );
}
