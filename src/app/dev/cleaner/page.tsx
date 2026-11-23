import { notFound } from "next/navigation";
import { marketplacePreviewEnabled } from "@/lib/marketplace-preview";
import { CleanerDashboardPreview } from "@/components/cleaner-workspace/dashboard-preview";
export const dynamic = "force-dynamic";
export const metadata = {
  title: "Cleaner Dashboard Demo | Sweaply",
  robots: { index: false, follow: false },
};
export default function CleanerPreview() {
  if (!marketplacePreviewEnabled()) notFound();
  return <CleanerDashboardPreview />;
}
