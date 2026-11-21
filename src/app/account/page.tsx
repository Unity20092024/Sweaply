import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  FileText,
  Heart,
  Sparkles,
  UsersRound,
  MessageCircle,
  CreditCard,
  ShieldCheck,
  MapPin,
  type LucideIcon,
} from "lucide-react";
import { AccountShell } from "@/components/account/account-shell";
import {
  RepeatCleanerForm,
  ProfileForm,
} from "@/components/account/account-forms";
import { authConfig } from "@/lib/supabase/config";
import {
  loadAccount,
  sections,
  label,
  dateLabel,
  type AccountSection,
  type Booking,
} from "@/lib/account";

function EmptyState({
  icon: Icon,
  title,
  children,
}: {
  icon: LucideIcon;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="account-empty">
      <span className="account-empty-icon">
        <Icon size={32} strokeWidth={1.3} />
      </span>
      <h2>{title}</h2>
      <p>{children}</p>
    </div>
  );
}
function Status({ value }: { value: string }) {
  return (
    <span
      className={`account-status ${value === "confirmed" || value === "completed" ? "status-complete" : ""}`}
    >
      {label(value)}
    </span>
  );
}
function BookingCard({
  booking,
  cleanerName,
}: {
  booking: Booking;
  cleanerName: string;
}) {
  return (
    <article className="account-record">
      <div className="record-heading">
        <h3>{label(booking.service)}</h3>
        <Status value={booking.status} />
      </div>
      <p>
        {cleanerName} · {dateLabel(booking.scheduled_for)}
      </p>
      {booking.status === "completed" && (
        <RepeatCleanerForm bookingId={booking.id} cleanerName={cleanerName} />
      )}
    </article>
  );
}

export default async function Account({
  searchParams,
}: {
  searchParams: Promise<{ section?: string; notice?: string }>;
}) {
  const params = await searchParams;
  const section: AccountSection = sections.includes(
    params.section as AccountSection,
  )
    ? (params.section as AccountSection)
    : "overview";
  if (!authConfig())
    return (
      <AccountShell section={section}>
        <span className="eyebrow">YOUR HOME, ALL IN ONE PLACE</span>
        <h1>
          A little less to do.
          <br />
          <span>More room for you.</span>
        </h1>
        <p className="customer-intro">
          Your cleaning plans will feel right at home here.
        </p>
        <div className="account-welcome">
          <Sparkles size={27} />
          <div>
            <h2>Your account space is on its way.</h2>
            <p>
              Account access is being prepared. No personal information is
              available until you can securely sign in.
            </p>
            <Link href="/sign-in" className="button button-outline">
              Back to Sign In <ArrowRight size={16} />
            </Link>
          </div>
        </div>
        <EmptyState icon={ShieldCheck} title="A thoughtful place for your home">
          Your quotes, bookings, and favorite cleaners will appear here once
          account access is ready.
        </EmptyState>
      </AccountShell>
    );
  const account = await loadAccount();
  if (account.error)
    return (
      <AccountShell section={section} authenticated email={account.user.email}>
        <span className="eyebrow">YOUR SWEAPLY ACCOUNT</span>
        <h1>Let’s try that again.</h1>
        <div className="account-error" role="alert">
          Your account information couldn’t be loaded. Please try again later.
        </div>
        <Link href="/account" className="button button-outline">
          Try again <ArrowRight size={16} />
        </Link>
      </AccountShell>
    );
  const cleanerName = (id: string) =>
    account.cleaners.find((c) => c.id === id)?.display_name ??
    "Your previous cleaner";
  const completed = account.bookings.filter((b) => b.status === "completed");
  const titles: Record<AccountSection, string> = {
    overview: "A little less to do.",
    quotes: "My Quotes",
    bookings: "My Bookings",
    cleaners: "My Cleaners",
    favorites: "Your favorites, all here.",
    messages: "A little conversation.",
    payments: "Payments & Receipts",
    settings: "Make yourself at home.",
  };
  return (
    <AccountShell section={section} authenticated email={account.user.email}>
      <span className="eyebrow">
        {account.name
          ? `WELCOME HOME, ${account.name}`
          : "WELCOME TO YOUR SWEAPLY SPACE"}
      </span>
      <h1>
        {titles[section]}
        {section === "overview" && (
          <>
            <br />
            <span>More room for you.</span>
          </>
        )}
      </h1>
      <p className="customer-intro">
        {section === "overview"
          ? "Your home, your people, your cleaning plans. All in one place."
          : "A clear view of your Sweaply account."}
      </p>
      {params.notice === "sign-out-failed" && (
        <p className="account-error" role="alert">
          We couldn’t complete sign-out. Please try Sign Out again.
        </p>
      )}
      {section === "overview" && (
        <>
          <div className="account-welcome">
            <Sparkles size={27} />
            <div>
              <h2>A fresh space for your fresh starts.</h2>
              <p>
                Keep track of your requests and reconnect with the cleaners
                you’ve worked with.
              </p>
              <Link href="/#services">
                Explore cleaning services <ArrowRight size={16} />
              </Link>
            </div>
          </div>
          <div className="account-stat-grid">
            {[
              {
                name: "Quotes",
                value: account.quotes.length,
                icon: FileText,
                key: "quotes",
              },
              {
                name: "Bookings",
                value: account.bookings.length,
                icon: CalendarDays,
                key: "bookings",
              },
              {
                name: "Favorites",
                value: account.favorites.length,
                icon: Heart,
                key: "favorites",
              },
            ].map(({ name, value, icon: Icon, key }) => (
              <Link
                className="account-stat"
                href={`/account?section=${key}`}
                key={key}
              >
                <Icon size={21} />
                <strong>{value === 100 ? "100+" : value}</strong>
                <span>{name}</span>
                <ArrowRight size={15} />
              </Link>
            ))}
          </div>
          <div className="account-section-heading">
            <h2>Your latest bookings</h2>
            <Link href="/account?section=bookings">
              View all <ArrowRight size={14} />
            </Link>
          </div>
          {account.bookings.length ? (
            account.bookings
              .slice(0, 3)
              .map((b) => (
                <BookingCard
                  key={b.id}
                  booking={b}
                  cleanerName={cleanerName(b.cleaner_id)}
                />
              ))
          ) : (
            <EmptyState
              icon={CalendarDays}
              title="A fresh calendar. A fresh start."
            >
              No bookings yet. Once an appointment is confirmed, you’ll find it
              here.
            </EmptyState>
          )}
          <div className="account-small-note">
            <ShieldCheck size={17} />
            <p>
              Requests stay pending until your cleaner accepts and all booking
              requirements are met.
            </p>
          </div>
        </>
      )}
      {section === "quotes" &&
        (account.quotes.length ? (
          account.quotes.map((q) => (
            <article className="account-record" key={q.id}>
              <div className="record-heading">
                <h3>{label(q.service)}</h3>
                <Status value={q.status} />
              </div>
              <p>{dateLabel(q.created_at)}</p>
              <strong>
                {q.estimate_cents === null
                  ? "Estimate being prepared"
                  : new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "USD",
                    }).format(q.estimate_cents / 100)}
              </strong>
            </article>
          ))
        ) : (
          <EmptyState
            icon={FileText}
            title="Your fresh start, with a clear estimate."
          >
            No quotes yet. Personalized cleaning estimates will appear here when
            available.
          </EmptyState>
        ))}
      {section === "bookings" && (
        <>
          {account.bookings.length ? (
            account.bookings.map((b) => (
              <BookingCard
                key={b.id}
                booking={b}
                cleanerName={cleanerName(b.cleaner_id)}
              />
            ))
          ) : (
            <EmptyState
              icon={CalendarDays}
              title="More time for life starts here."
            >
              You don’t have any bookings yet. A request is only confirmed after
              cleaner acceptance and booking requirements are met.
            </EmptyState>
          )}
          {account.requests.length > 0 && (
            <>
              <div className="account-section-heading">
                <h2>Your repeat-cleaner requests</h2>
              </div>
              {account.requests.map((r) => (
                <article className="account-record" key={r.id}>
                  <div className="record-heading">
                    <h3>{cleanerName(r.cleaner_id)}</h3>
                    <Status value={r.status} />
                  </div>
                  <p>Preferred date: {dateLabel(r.preferred_date)}</p>
                  <p className="account-fine">
                    A request is not a confirmed appointment.
                  </p>
                </article>
              ))}
            </>
          )}
        </>
      )}
      {section === "cleaners" && (
        <>
          {completed.length ? (
            [...new Set(completed.map((b) => b.cleaner_id))].map((id) => (
              <article className="account-record" key={id}>
                <h3>{cleanerName(id)}</h3>
                <p>You’ve completed a cleaning with this professional.</p>
                <Link href="/account?section=bookings">
                  Request again from a completed job <ArrowRight size={15} />
                </Link>
              </article>
            ))
          ) : (
            <EmptyState
              icon={UsersRound}
              title="Meet your future favorite cleaner."
            >
              After your first completed cleaning, your cleaner will appear
              here. You’ll be able to request them again from that job.
            </EmptyState>
          )}
        </>
      )}
      {section === "favorites" &&
        (account.favorites.length ? (
          account.favorites.map((f) => (
            <article className="account-record" key={f.cleaner_id}>
              <h3>
                {account.cleaners.find((c) => c.id === f.cleaner_id)
                  ?.display_name ?? "Cleaner profile currently unavailable"}
              </h3>
              <p>Saved to your favorites.</p>
            </article>
          ))
        ) : (
          <EmptyState icon={Heart} title="Good connections are worth keeping.">
            No favorites yet. Your saved cleaning professionals will appear here
            when cleaner discovery is available.
          </EmptyState>
        ))}
      {section === "messages" &&
        (account.messages.length ? (
          account.messages.map((m) => (
            <article className="account-record" key={m.id}>
              <h3>{m.subject}</h3>
              <p className="message-body">{m.body}</p>
              <span className="account-fine">{dateLabel(m.created_at)}</span>
            </article>
          ))
        ) : (
          <EmptyState
            icon={MessageCircle}
            title="Room for a little conversation."
          >
            No messages yet. Account messages will appear here when available.
            Sending messages is coming in a later phase.
          </EmptyState>
        ))}
      {section === "payments" &&
        (account.receipts.length ? (
          account.receipts.map((r) => (
            <article className="account-record" key={r.id}>
              <h3>Receipt · {dateLabel(r.issued_at)}</h3>
              <p>
                {new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: r.currency,
                }).format(r.amount_cents / 100)}
              </p>
              <span className="account-fine">Receipt reference: {r.id}</span>
            </article>
          ))
        ) : (
          <EmptyState icon={CreditCard} title="Clear records. Peace of mind.">
            No payment records or receipts yet. Online payments aren’t available
            in this phase.
          </EmptyState>
        ))}
      {section === "settings" && (
        <>
          <section className="account-record">
            <h2>Your details</h2>
            <p>{account.user.email}</p>
            <ProfileForm name={account.name ?? ""} />
            <Link href="/forgot-password">
              Reset your password <ArrowRight size={15} />
            </Link>
          </section>
          <section className="account-record">
            <h2>Saved addresses</h2>
            {account.addresses.length ? (
              account.addresses.map((a) => (
                <address key={a.id}>
                  <MapPin size={16} />
                  <div>
                    <strong>{a.label}</strong>
                    <br />
                    {a.line1}
                    {a.line2 && (
                      <>
                        <br />
                        {a.line2}
                      </>
                    )}
                    <br />
                    {a.city}, {a.state} {a.postal_code}
                  </div>
                </address>
              ))
            ) : (
              <p>
                No saved addresses. Address management will be added with the
                booking flow.
              </p>
            )}
          </section>
        </>
      )}
    </AccountShell>
  );
}
