"use client";
import { useRef, useState } from "react";
import { ArrowLeft, ArrowRight, LockKeyhole, Check } from "lucide-react";
const areas = ["Minneapolis", "St. Paul", "Surrounding Twin Cities suburbs"];
const specialties = ["Standard Cleaning", "Deep Cleaning", "Move-Out Cleaning"];
const days = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];
export function CleanerApplication() {
  const fields = useRef<HTMLDivElement>(null);
  const [error, setError] = useState("");
  const [review, setReview] = useState(false);
  const [selectedAreas, setAreas] = useState<string[]>([]);
  const [services, setServices] = useState<string[]>([]);
  const [availability, setAvailability] = useState<string[]>([]);
  const toggle = (
    value: string,
    list: string[],
    setter: (values: string[]) => void,
  ) =>
    setter(
      list.includes(value) ? list.filter((v) => v !== value) : [...list, value],
    );
  return (
    <section className="application-card" aria-labelledby="application-title">
      <div className="application-heading">
        <span className="eyebrow">YOUR NEXT CHAPTER</span>
        <h2 id="application-title">Let’s get to know you.</h2>
        <p>Tell us about the care you bring to a home.</p>
      </div>
      <div className="market-notice">
        <LockKeyhole size={20} />
        <div>
          <strong>Application preview · not accepting submissions</strong>
          <p>
            Online applications are not open. Your entries stay only on this
            page and disappear on reload. Nothing will be sent or saved.
          </p>
        </div>
      </div>
      <div ref={fields} hidden={review} className="application-fields">
        <fieldset>
          <legend>
            <span>01</span> A little introduction
          </legend>
          <div className="market-field-grid">
            <div className="market-field">
              <label htmlFor="app-name">Full name</label>
              <input
                id="app-name"
                name="name"
                autoComplete="name"
                required
                maxLength={80}
                placeholder="Your name"
              />
            </div>
            <div className="market-field">
              <label htmlFor="app-email">Email address</label>
              <input
                id="app-email"
                type="email"
                name="email"
                autoComplete="email"
                required
                maxLength={254}
                placeholder="you@example.com"
              />
            </div>
          </div>
          <div className="market-field">
            <label htmlFor="app-phone">
              Phone <span>Optional</span>
            </label>
            <input
              id="app-phone"
              type="tel"
              name="phone"
              autoComplete="tel"
              maxLength={30}
              placeholder="Your preferred contact number"
            />
          </div>
        </fieldset>
        <fieldset>
          <legend>
            <span>02</span> Your cleaning experience
          </legend>
          <div className="market-field">
            <label htmlFor="app-experience">Professional experience</label>
            <select
              id="app-experience"
              name="experience"
              required
              defaultValue=""
            >
              <option value="">Choose your experience</option>
              <option>New to professional cleaning</option>
              <option>Less than 1 year</option>
              <option>1–3 years</option>
              <option>More than 3 years</option>
            </select>
          </div>
          <div className="market-field">
            <label htmlFor="app-about">
              A little about your approach <span>Optional</span>
            </label>
            <textarea
              id="app-about"
              name="about"
              rows={3}
              maxLength={1500}
              placeholder="What does a thoughtfully clean home mean to you?"
            />
          </div>
          <h3>Cleaning specialties</h3>
          <p>Choose the services you’d like to offer.</p>
          <div className="market-choice-grid">
            {specialties.map((s) => (
              <label className="market-check" key={s}>
                <input
                  type="checkbox"
                  checked={services.includes(s)}
                  onChange={() => toggle(s, services, setServices)}
                />
                <span>{s}</span>
              </label>
            ))}
          </div>
        </fieldset>
        <fieldset>
          <legend>
            <span>03</span> Your area & rhythm
          </legend>
          <h3>Preferred service areas</h3>
          <div className="market-choice-grid">
            {areas.map((a) => (
              <label className="market-check" key={a}>
                <input
                  type="checkbox"
                  checked={selectedAreas.includes(a)}
                  onChange={() => toggle(a, selectedAreas, setAreas)}
                />
                <span>{a}</span>
              </label>
            ))}
          </div>
          <h3>Preferred days</h3>
          <p>
            Preferences only. This does not publish availability or commit you
            to jobs.
          </p>
          <div className="market-day-grid">
            {days.map((d) => (
              <label className="market-check" key={d}>
                <input
                  type="checkbox"
                  checked={availability.includes(d)}
                  onChange={() => toggle(d, availability, setAvailability)}
                />
                <span>{d}</span>
              </label>
            ))}
          </div>
          <div className="market-field">
            <label htmlFor="app-time">Preferred time of day</label>
            <select id="app-time" name="time" defaultValue="Flexible">
              <option>Flexible</option>
              <option>Mornings</option>
              <option>Afternoons</option>
              <option>Evenings</option>
            </select>
          </div>
        </fieldset>
        <fieldset>
          <legend>
            <span>04</span> One more detail
          </legend>
          <div className="market-field">
            <label htmlFor="app-insurance">
              Current business insurance <span>Optional · self-reported</span>
            </label>
            <select
              id="app-insurance"
              name="insurance"
              defaultValue="Prefer not to say"
            >
              <option>Prefer not to say</option>
              <option>I currently carry business insurance</option>
              <option>I do not currently carry business insurance</option>
            </select>
          </div>
          <p className="market-privacy">
            Do not enter policy numbers, Social Security numbers, customer
            addresses, or sensitive documents. Document uploads are not
            collected here. Self-reported information is not verified.
          </p>
        </fieldset>
        {error && (
          <p role="alert" className="market-error">
            {error}
          </p>
        )}
        <button
          type="button"
          className="button button-primary"
          onClick={() => {
            const invalid = [
              ...(fields.current?.querySelectorAll<
                HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
              >("input,select,textarea") ?? []),
            ].find((input) => !input.checkValidity());
            if (invalid) {
              invalid.reportValidity();
              setError("Please check your name, email, and experience.");
              return;
            }
            if (
              !services.length ||
              !selectedAreas.length ||
              !availability.length
            ) {
              setError(
                "Choose at least one specialty, service area, and preferred day.",
              );
              return;
            }
            setError("");
            setReview(true);
          }}
        >
          Review application <ArrowRight size={18} />
        </button>
      </div>
      {review && (
        <div className="application-review">
          <span className="market-tag">
            LOCAL REVIEW · NOT AN APPLICATION SUBMISSION
          </span>
          <h3>Your next chapter, thoughtfully planned.</h3>
          <ul>
            {[
              `${services.join(" · ")}`,
              selectedAreas.join(" · "),
              `${availability.length} preferred day${availability.length === 1 ? "" : "s"}`,
            ].map((item) => (
              <li key={item}>
                <Check size={17} />
                {item}
              </li>
            ))}
          </ul>
          <p role="status">
            This is only a local review of your entries. No application,
            account, or cleaner profile has been created. We’ll need a connected
            backend before applications can be accepted.
          </p>
          <button className="button button-primary" disabled>
            Submit application · unavailable
          </button>
          <button className="market-back" onClick={() => setReview(false)}>
            <ArrowLeft size={16} /> Edit your details
          </button>
        </div>
      )}
    </section>
  );
}
