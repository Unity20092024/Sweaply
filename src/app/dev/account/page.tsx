import { notFound } from "next/navigation";
import { accountPreviewEnabled } from "@/lib/development";
import { AccountDashboard } from "@/components/account/account-dashboard";
import { demoSnapshot } from "@/lib/account-demo";
import { sections, type AccountSection } from "@/lib/account";
import "../../account/account.css";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Development UI Preview | Sweaply",
  robots: { index: false, follow: false },
};
export default async function AccountPreview({
  searchParams,
}: {
  searchParams: Promise<{ section?: string; scenario?: string }>;
}) {
  // Never a production route or a way around authenticated account protection.
  if (!accountPreviewEnabled()) notFound();
  const params = await searchParams;
  const section: AccountSection = sections.includes(
    params.section as AccountSection,
  )
    ? (params.section as AccountSection)
    : "overview";
  const completed = params.scenario === "completed";
  return (
    <AccountDashboard
      account={demoSnapshot(completed)}
      section={section}
      preview
      basePath={completed ? "/dev/account?scenario=completed" : "/dev/account"}
    />
  );
}
