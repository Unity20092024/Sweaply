import Link from "next/link";
import {
  LayoutGrid,
  FileText,
  CalendarDays,
  UsersRound,
  Heart,
  MessageCircle,
  CreditCard,
  Settings,
  LogOut,
  ArrowLeft,
  Sparkles,
} from "lucide-react";
import { SweaplyLogo } from "@/components/branding/sweaply-logo";
import { signOut } from "@/app/(auth)/actions";
import type { AccountSection } from "@/lib/account";
const navigation = [
  { key: "overview", label: "My Overview", icon: LayoutGrid },
  { key: "quotes", label: "My Quotes", icon: FileText },
  { key: "bookings", label: "My Bookings", icon: CalendarDays },
  { key: "cleaners", label: "My Cleaners", icon: UsersRound },
  { key: "favorites", label: "Favorites", icon: Heart },
  { key: "messages", label: "Messages", icon: MessageCircle },
  { key: "payments", label: "Payments & Receipts", icon: CreditCard },
  { key: "settings", label: "Account Settings", icon: Settings },
] as const;
export function AccountShell({
  children,
  section,
  email,
  authenticated = false,
  preview = false,
  basePath = "/account",
}: {
  children: React.ReactNode;
  section: AccountSection;
  email?: string;
  authenticated?: boolean;
  preview?: boolean;
  basePath?: string;
}) {
  return (
    <div className="customer-page">
      <header className="customer-header">
        <SweaplyLogo priority />
        <Link href="/" className="customer-home">
          <ArrowLeft size={15} /> Back to home
        </Link>
      </header>
      <div className="customer-layout">
        <aside className="customer-sidebar">
          <span className="customer-label">
            {preview ? "DEVELOPMENT UI PREVIEW" : "YOUR SWEAPLY SPACE"}
          </span>
          <nav aria-label="Customer account">
            {navigation.map(({ key, label, icon: Icon }) => (
              <Link
                href={
                  key === "overview"
                    ? basePath
                    : `${basePath}${basePath.includes("?") ? "&" : "?"}section=${key}`
                }
                key={key}
                aria-current={key === section ? "page" : undefined}
              >
                <Icon size={18} strokeWidth={1.6} />
                <span>{label}</span>
              </Link>
            ))}
          </nav>
          <div className="sidebar-bottom">
            <Sparkles size={20} />
            <p>
              Less on your list.
              <br />
              <strong>More room for you.</strong>
            </p>
            {authenticated && !preview ? (
              <form action={signOut}>
                <button>
                  <LogOut size={16} /> Sign Out
                </button>
              </form>
            ) : (
              <Link href="/sign-in">
                Sign in <ArrowLeft size={14} />
              </Link>
            )}
          </div>
        </aside>
        <main id="main" className="customer-main">
          {preview && (
            <aside
              className="account-demo-banner"
              aria-label="Development demonstration notice"
            >
              <strong>DEVELOPMENT DEMO · NOT A REAL ACCOUNT</strong>
              <p>
                No authentication, account, session, or database connection is
                active. These are UI fixtures; actions do not save or submit
                anything.
              </p>
              <div>
                <Link href="/dev/account">Empty dashboard</Link>
                <Link href="/dev/account?section=bookings&scenario=completed">
                  Repeat-cleaner UI fixture
                </Link>
              </div>
            </aside>
          )}
          {children}
        </main>
      </div>
      <footer className="customer-footer">
        <span>© {new Date().getFullYear()} Sweaply</span>
        <span>{email || "Minneapolis–St. Paul, Minnesota"}</span>
      </footer>
    </div>
  );
}
