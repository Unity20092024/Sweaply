"use client";
import Image from "next/image";
import { useState } from "react";
import {
  ArrowRight,
  CalendarDays,
  Check,
  ClipboardCheck,
  Clock3,
  ImageIcon,
  Inbox,
  MapPin,
  Settings2,
  Sparkles,
  UserRound,
  BriefcaseBusiness,
} from "lucide-react";
import { CleanerWorkspaceShell } from "./shell";
import { GalleryPreview } from "./gallery-preview";
import { demoDecision, type DemoRequestStatus } from "@/lib/marketplace";
const tabs = [
  { key: "profile", label: "My Profile", icon: UserRound },
  { key: "requests", label: "Incoming Requests", icon: Inbox },
  { key: "jobs", label: "My Jobs", icon: BriefcaseBusiness },
  { key: "availability", label: "Availability", icon: CalendarDays },
  { key: "checklist", label: "Completion Checklist", icon: ClipboardCheck },
  { key: "gallery", label: "Before-and-After Gallery", icon: ImageIcon },
] as const;
type Tab = (typeof tabs)[number]["key"];
const requests = [
  {
    id: "demo-request-a",
    service: "Move-Out Cleaning",
    area: "Minneapolis · fictional service area",
    date: "Example preferred date · not availability",
    size: "Example 2-bedroom home",
    notes:
      "Fictional request to test acceptance. No customer or real appointment exists.",
  },
  {
    id: "demo-request-b",
    service: "Deep Cleaning",
    area: "St. Paul · fictional service area",
    date: "Example preferred date · not availability",
    size: "Example 1-bedroom home",
    notes:
      "Fictional request to test declining. This is not a live cleaning request.",
  },
];
const tasks = [
  "Review the agreed cleaning checklist",
  "Clean kitchen surfaces and appliance exteriors",
  "Clean bathroom fixtures and surfaces",
  "Dust reachable surfaces",
  "Vacuum and mop agreed floor areas",
  "Complete a final walkthrough",
];
export function CleanerDashboardPreview() {
  const [tab, setTab] = useState<Tab>("requests");
  const [decisions, setDecisions] = useState<Record<string, DemoRequestStatus>>(
    {},
  );
  const [notice, setNotice] = useState("");
  const [availableDays, setDays] = useState<string[]>([]);
  const [checked, setChecked] = useState<string[]>([]);
  const [profileName, setProfileName] = useState(
    "Demo professional · fictional profile",
  );
  const chooseTab = (next: Tab) => {
    setTab(next);
    setNotice("");
  };
  const accept = (id: string, decision: "accept" | "decline") => {
    setDecisions({
      ...decisions,
      [id]: demoDecision(
        decisions[id] ?? "pending_cleaner_acceptance",
        decision,
      ),
    });
    setNotice(
      decision === "accept"
        ? "Demo acceptance only. Booking requirements are still outstanding. Nothing is confirmed, saved, or sent."
        : "Demo decline only. No real request has been changed or customer notified.",
    );
  };
  return (
    <CleanerWorkspaceShell
      preview
      navigation={
        <nav aria-label="Cleaner dashboard demo">
          {tabs.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              aria-pressed={tab === key}
              onClick={() => chooseTab(key)}
            >
              <Icon size={18} strokeWidth={1.6} />
              {label}
            </button>
          ))}
        </nav>
      }
    >
      <div className="workspace-title">
        <div>
          <span className="eyebrow">A THOUGHTFUL SPACE FOR YOUR WORK</span>
          <h1>{tabs.find((t) => t.key === tab)?.label}</h1>
          <p>Less to keep track of. More room for your craft.</p>
        </div>
        <span className="market-tag">UI PREVIEW ONLY</span>
      </div>
      {notice && (
        <p className="market-notice" role="status">
          {notice}
        </p>
      )}
      {tab === "requests" && (
        <>
          <div className="workspace-section-heading">
            <h2>A little connection starts here.</h2>
            <span>2 fictional request fixtures</span>
          </div>
          {requests.map((r) => {
            const status = decisions[r.id] ?? "pending_cleaner_acceptance";
            return (
              <article className="workspace-card request-card" key={r.id}>
                <div className="workspace-record-heading">
                  <span className="market-tag">
                    FICTIONAL REQUEST · NOT A CUSTOMER
                  </span>
                  <span className="workspace-status">
                    {status === "pending_cleaner_acceptance"
                      ? "Pending Cleaner Acceptance"
                      : status === "declined"
                        ? "Demo · Declined"
                        : "Demo · Awaiting Confirmation"}
                  </span>
                </div>
                <h2>{r.service}</h2>
                <p>
                  <MapPin size={15} />
                  {r.area}
                </p>
                <p>
                  <CalendarDays size={15} />
                  {r.date}
                </p>
                <p className="request-size">{r.size}</p>
                <p>{r.notes}</p>
                {status === "pending_cleaner_acceptance" ? (
                  <div className="request-decisions">
                    <button
                      className="button button-primary"
                      onClick={() => accept(r.id, "accept")}
                    >
                      <Check size={17} /> Accept · demo
                    </button>
                    <button
                      className="button button-outline"
                      onClick={() => accept(r.id, "decline")}
                    >
                      Decline · demo
                    </button>
                  </div>
                ) : (
                  <div className="workspace-decision-note">
                    <Clock3 size={18} />
                    <p>
                      {status === "declined"
                        ? "Local decline preview. Nothing was sent or saved."
                        : "Cleaner acceptance is only one step. Booking requirements have not been met — this is not a confirmed job."}
                    </p>
                  </div>
                )}
              </article>
            );
          })}
          <button
            className="market-back"
            onClick={() => {
              setDecisions({});
              setNotice("Demo fixtures reset. No real data changed.");
            }}
          >
            Reset request demonstration <Settings2 size={15} />
          </button>
        </>
      )}
      {tab === "profile" && (
        <section className="workspace-card">
          <div className="workspace-profile">
            <div className="workspace-portrait">
              <Image
                src="/images/demo-cleaners/portrait-a.jpg"
                alt="Stock model for a fictional cleaner profile"
                fill
                sizes="100px"
              />
            </div>
            <div>
              <span className="market-tag">
                STOCK PHOTO · NOT A REAL CLEANER
              </span>
              <h2>Your care, in your own words.</h2>
              <p>No public cleaner profile is created or published.</p>
            </div>
          </div>
          <div className="market-fields">
            <div className="market-field">
              <label htmlFor="cleaner-demo-name">
                Display name · fictional
              </label>
              <input
                id="cleaner-demo-name"
                value={profileName}
                maxLength={80}
                onChange={(e) => setProfileName(e.target.value)}
              />
            </div>
            <div className="market-field">
              <label htmlFor="cleaner-demo-bio">
                Short professional biography
              </label>
              <textarea
                id="cleaner-demo-bio"
                rows={4}
                maxLength={1500}
                defaultValue="Development fixture only. Tell customers about your approach to a thoughtfully cleaned home."
              />
            </div>
            <div className="market-field">
              <label htmlFor="cleaner-demo-area">Service area</label>
              <input
                id="cleaner-demo-area"
                defaultValue="Twin Cities · demo preference only"
                maxLength={120}
              />
            </div>
            <fieldset className="workspace-specialties">
              <legend>Specialties · demonstration</legend>
              {["Standard Cleaning", "Deep Cleaning", "Move-Out Cleaning"].map(
                (s) => (
                  <label className="market-check" key={s}>
                    <input type="checkbox" />
                    {s}
                  </label>
                ),
              )}
            </fieldset>
            <button
              className="button button-outline"
              onClick={() =>
                setNotice(
                  "Profile preview only. No profile changes were saved or published.",
                )
              }
            >
              Preview profile changes <ArrowRight size={16} />
            </button>
          </div>
        </section>
      )}
      {tab === "jobs" && (
        <>
          {requests.filter(
            (r) => decisions[r.id] === "accepted_awaiting_confirmation",
          ).length ? (
            requests
              .filter(
                (r) => decisions[r.id] === "accepted_awaiting_confirmation",
              )
              .map((r) => (
                <article className="workspace-card" key={r.id}>
                  <span className="market-tag">FICTIONAL JOB PREVIEW</span>
                  <h2>{r.service}</h2>
                  <span className="workspace-status">
                    Awaiting Confirmation · Demo
                  </span>
                  <p>
                    There is no confirmed appointment, verified availability, or
                    booked customer. Acceptance alone does not complete booking
                    requirements.
                  </p>
                  <button
                    className="button button-outline"
                    onClick={() => chooseTab("checklist")}
                  >
                    Explore completion checklist <ArrowRight size={16} />
                  </button>
                </article>
              ))
          ) : (
            <section className="workspace-card workspace-empty">
              <span className="workspace-icon">
                <BriefcaseBusiness size={30} />
              </span>
              <h2>Room for your next fresh start.</h2>
              <p>
                No real jobs are booked. Accept a fictional request in the
                demonstration to explore the awaiting-confirmation state.
              </p>
              <button
                className="button button-outline"
                onClick={() => chooseTab("requests")}
              >
                Explore demo requests <ArrowRight size={16} />
              </button>
            </section>
          )}
          <p className="market-privacy">
            This workspace never creates a real booking. All jobs here are
            explicitly fictional UI states.
          </p>
        </>
      )}
      {tab === "availability" && (
        <section className="workspace-card">
          <span className="workspace-icon">
            <CalendarDays size={29} />
          </span>
          <h2>Make room for your rhythm.</h2>
          <p>
            Choose days to explore the interface. Nothing is published, and no
            actual availability can be inferred.
          </p>
          <div className="workspace-days">
            {[
              "Monday",
              "Tuesday",
              "Wednesday",
              "Thursday",
              "Friday",
              "Saturday",
              "Sunday",
            ].map((day) => (
              <button
                key={day}
                aria-pressed={availableDays.includes(day)}
                onClick={() =>
                  setDays(
                    availableDays.includes(day)
                      ? availableDays.filter((d) => d !== day)
                      : [...availableDays, day],
                  )
                }
              >
                {day}
                {availableDays.includes(day) && <Check size={15} />}
              </button>
            ))}
          </div>
          <div className="market-field-grid">
            <div className="market-field">
              <label htmlFor="demo-start">
                Preferred start · local preview
              </label>
              <input id="demo-start" type="time" />
            </div>
            <div className="market-field">
              <label htmlFor="demo-end">Preferred end · local preview</label>
              <input id="demo-end" type="time" />
            </div>
          </div>
          <button
            className="button button-outline"
            onClick={() =>
              setNotice(
                `Local preview: ${availableDays.length} preferred days selected. No availability was saved or published.`,
              )
            }
          >
            Preview availability <ArrowRight size={16} />
          </button>
        </section>
      )}
      {tab === "checklist" && (
        <section className="workspace-card">
          <span className="market-tag">
            FICTIONAL JOB · CHECKLIST DEMONSTRATION
          </span>
          <h2>Care, down to the details.</h2>
          <p>
            A sample checklist for UI testing. Real checklists will match the
            agreed service and customer scope.
          </p>
          <div className="workspace-progress">
            <span
              style={{ width: `${(checked.length / tasks.length) * 100}%` }}
            />
          </div>
          <p className="checklist-count">
            {checked.length} of {tasks.length} demo items checked
          </p>
          <div className="workspace-checklist">
            {tasks.map((task) => (
              <label key={task}>
                <input
                  type="checkbox"
                  checked={checked.includes(task)}
                  onChange={() =>
                    setChecked(
                      checked.includes(task)
                        ? checked.filter((t) => t !== task)
                        : [...checked, task],
                    )
                  }
                />
                <span>{task}</span>
              </label>
            ))}
          </div>
          <button
            className="button button-outline"
            disabled={checked.length !== tasks.length}
            onClick={() =>
              setNotice(
                "Completion preview only. No job was marked complete and no customer or payment system was notified.",
              )
            }
          >
            Preview completion <ClipboardCheck size={17} />
          </button>
        </section>
      )}
      {tab === "gallery" && <GalleryPreview />}
      <div className="workspace-bottom-note">
        <Sparkles size={17} />
        <p>
          Local demonstration only. Real cleaner decisions and customer bookings
          need a connected, authorized backend.
        </p>
      </div>
    </CleanerWorkspaceShell>
  );
}
