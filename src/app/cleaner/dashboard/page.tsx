import Link from "next/link";
import { ArrowRight, Sparkles, LockKeyhole } from "lucide-react";
import { CleanerWorkspaceShell } from "@/components/cleaner-workspace/shell";
import { marketplacePreviewEnabled } from "@/lib/marketplace-preview";
export const dynamic = "force-dynamic";
export const metadata = {
  title: "Cleaner Workspace | Sweaply",
  robots: { index: false, follow: false },
};
export default function CleanerDashboardStatus() {
  return (
    <CleanerWorkspaceShell
      navigation={
        <nav aria-label="Future cleaner workspace">
          {[
            "My Profile",
            "Incoming Requests",
            "My Jobs",
            "Availability",
            "Completion Checklist",
            "Before-and-After Gallery",
          ].map((s) => (
            <span aria-disabled="true" key={s}>
              {s}
              <small>Coming later</small>
            </span>
          ))}
        </nav>
      }
    >
      <span className="eyebrow">YOUR CARE. YOUR NEXT CHAPTER.</span>
      <h1>
        Your work.
        <br />
        <span>Your rhythm.</span>
      </h1>
      <div className="workspace-card workspace-empty">
        <span className="workspace-icon">
          <LockKeyhole size={30} />
        </span>
        <h2>Your workspace is on its way.</h2>
        <p>
          Cleaner accounts are not connected yet. No profile, requests, jobs, or
          availability are live. Explore the cleaner application preview while
          we prepare the experience.
        </p>
        <Link href="/become-a-cleaner" className="button button-outline">
          Explore the application <ArrowRight size={16} />
        </Link>
        {marketplacePreviewEnabled() && (
          <Link className="market-back" href="/dev/cleaner">
            <Sparkles size={16} /> Open labeled development dashboard
          </Link>
        )}
      </div>
    </CleanerWorkspaceShell>
  );
}
