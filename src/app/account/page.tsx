import Link from "next/link";
import { ArrowRight, Sparkles, ShieldCheck } from "lucide-react";
import { AccountShell } from "@/components/account/account-shell";
import {
  AccountDashboard,
  EmptyState,
} from "@/components/account/account-dashboard";
import { authConfig } from "@/lib/supabase/config";
import { loadAccount, sections, type AccountSection } from "@/lib/account";

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
          {process.env.NODE_ENV === "development" &&
            process.env.SWEAPLY_ENABLE_ACCOUNT_PREVIEW === "true" && (
              <Link href="/dev/account">
                Open labeled development UI preview.{" "}
              </Link>
            )}
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
  return (
    <AccountDashboard
      account={account}
      section={section}
      email={account.user.email}
      notice={params.notice}
    />
  );
}
