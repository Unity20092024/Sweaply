import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Sparkles } from "lucide-react";
import { MarketplaceFrame } from "@/components/marketplace/frame";
import { CleanerCarousel } from "@/components/cleaners/cleaner-carousel";
import { developmentCleaners } from "@/lib/cleaner-fixtures";
import { marketplacePreviewEnabled } from "@/lib/marketplace-preview";
export const dynamic = "force-dynamic";
export const metadata = {
  title: "Development Marketplace Preview | Sweaply",
  robots: { index: false, follow: false },
};
export default function MarketplacePreview() {
  if (!marketplacePreviewEnabled()) notFound();
  return (
    <MarketplaceFrame>
      <div className="market-preview-page market-container">
        <aside className="workspace-demo">
          <strong>DEVELOPMENT DEMO · NO REAL CLEANERS OR BOOKINGS</strong>
          <p>
            Profiles use stock portraits and fictional names for UI testing
            only. No ratings, reviews, availability, or work evidence is
            fabricated. Nothing is submitted or saved.
          </p>
        </aside>
        <span className="eyebrow">
          <Sparkles size={14} /> YOUR NEXT FRESH START
        </span>
        <h1>
          The Cleaner
          <br />
          <span>Request Area</span>
        </h1>
        <p className="market-muted">
          Explore the cards, open a profile, and review a preferred cleaning
          plan. This preview does not create a real request.
        </p>
        <CleanerCarousel cleaners={developmentCleaners} />
        <Link className="button button-outline" href="/dev/cleaner">
          Explore cleaner dashboard demo <ArrowRight size={16} />
        </Link>
      </div>
    </MarketplaceFrame>
  );
}
