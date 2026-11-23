"use client";
import { useState } from "react";
import { ArrowLeft, ArrowRight, CalendarDays, Clock3 } from "lucide-react";
import { cleaningServices, futureDate } from "@/lib/marketplace";
export function RequestCleaner({
  cleanerName,
  fixture,
  onBack,
}: {
  cleanerName: string;
  fixture?: boolean;
  onBack: () => void;
}) {
  const [service, setService] = useState<string>("");
  const [date, setDate] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");
  const [review, setReview] = useState(false);
  return (
    <div className="market-request">
      <button className="market-back" onClick={onBack}>
        <ArrowLeft size={16} /> Back to profile
      </button>
      <span className="eyebrow">YOUR SPACE. YOUR PREFERRED CLEANER.</span>
      <h2 tabIndex={-1}>Request {cleanerName}</h2>
      <p className="market-muted">
        {fixture
          ? "This is a development profile, not a real cleaning professional. "
          : ""}
        Plan the details below. Online requests aren’t available yet; you can
        review a plan without sending it.
      </p>
      <div className="market-notice">
        <Clock3 size={19} />
        <div>
          <strong>Pending Cleaner Acceptance</strong>
          <p>
            This is the required starting status for a future request. A
            preferred date is not verified availability, and a request is not a
            confirmed booking.
          </p>
        </div>
      </div>
      {!review ? (
        <div
          className="market-fields"
          role="group"
          aria-label="Cleaning request preview"
        >
          <div className="market-field">
            <label htmlFor="request-service">Cleaning service</label>
            <select
              id="request-service"
              value={service}
              onChange={(e) => setService(e.target.value)}
              required
            >
              <option value="">Choose your service</option>
              {cleaningServices.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </div>
          <div className="market-field">
            <label htmlFor="request-date">
              <CalendarDays size={15} /> Preferred date
            </label>
            <input
              id="request-date"
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
            <small>
              Choose a future date. Cleaner availability is not connected.
            </small>
          </div>
          <div className="market-field">
            <label htmlFor="request-notes">
              Anything else? <span>Optional</span>
            </label>
            <textarea
              id="request-notes"
              maxLength={1000}
              rows={4}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Share cleaning priorities. Please leave out addresses and private details."
            />
            <small>{notes.length}/1000 · Kept only on this page.</small>
          </div>
          {error && (
            <p className="market-error" role="alert">
              {error}
            </p>
          )}
          <button
            className="button button-primary"
            type="button"
            onClick={() => {
              if (
                !cleaningServices.includes(
                  service as (typeof cleaningServices)[number],
                )
              )
                return setError("Choose a cleaning service.");
              if (!futureDate(date))
                return setError("Choose a valid future preferred date.");
              setError("");
              setReview(true);
            }}
          >
            Review request <ArrowRight size={17} />
          </button>
        </div>
      ) : (
        <div className="market-request-review">
          <span className="market-tag">LOCAL PREVIEW · NOT SUBMITTED</span>
          <h3>Your preferred cleaning plan</h3>
          <dl>
            <div>
              <dt>Cleaner</dt>
              <dd>{cleanerName}</dd>
            </div>
            <div>
              <dt>Service</dt>
              <dd>{service}</dd>
            </div>
            <div>
              <dt>Preferred date</dt>
              <dd>{date}</dd>
            </div>
            {notes && (
              <div>
                <dt>Notes</dt>
                <dd>{notes}</dd>
              </div>
            )}
          </dl>
          <p role="status" className="market-notice">
            Nothing has been sent, saved, accepted, or confirmed. A connected
            backend and cleaner acceptance are required before any booking can
            proceed.
          </p>
          <button className="button button-primary" disabled>
            Submit request · unavailable
          </button>
          <button className="market-back" onClick={() => setReview(false)}>
            <ArrowLeft size={15} /> Edit details
          </button>
        </div>
      )}
    </div>
  );
}
