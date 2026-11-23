import Image from "next/image";
import { CalendarDays, MapPin, Sparkles, HeartHandshake } from "lucide-react";
import { MarketplaceFrame } from "@/components/marketplace/frame";
import { CleanerApplication } from "@/components/marketplace/cleaner-application";
export const metadata = {
  title: "Become a Sweaply Cleaner | Twin Cities",
  description:
    "Explore the Sweaply cleaner application preview for independent cleaning professionals in Minneapolis–St. Paul.",
};
export default function BecomeCleaner() {
  return (
    <MarketplaceFrame>
      <section className="application-hero market-container">
        <div>
          <span className="eyebrow">
            <Sparkles size={15} /> LOCAL PEOPLE. FRESH POSSIBILITIES.
          </span>
          <h1>
            Bring your care.
            <br />
            <span>Make room for more.</span>
          </h1>
          <p>
            A place for independent cleaning professionals who bring a little
            extra care to homes across the Twin Cities.
          </p>
          <a href="#application" className="button button-primary">
            Explore the application <HeartHandshake size={18} />
          </a>
          <span className="market-location">
            <MapPin size={14} /> Minneapolis–St. Paul, Minnesota
          </span>
        </div>
        <div className="application-hero-photo">
          <Image
            src="/images/kitchen.jpg"
            alt="A bright, thoughtfully cared-for kitchen"
            fill
            priority
            sizes="(max-width: 767px) 100vw, 50vw"
          />
        </div>
      </section>
      <div className="application-benefits market-container">
        {[
          {
            icon: HeartHandshake,
            title: "Your kind of clean",
            text: "Tell us which cleaning services fit your experience.",
          },
          {
            icon: CalendarDays,
            title: "Your preferred rhythm",
            text: "Share the days and areas that work for you.",
          },
          {
            icon: Sparkles,
            title: "A thoughtful connection",
            text: "Future requests will need your acceptance first.",
          },
        ].map(({ icon: Icon, title, text }) => (
          <div key={title}>
            <Icon size={25} strokeWidth={1.5} />
            <h3>{title}</h3>
            <p>{text}</p>
          </div>
        ))}
      </div>
      <div id="application" className="application-section market-container">
        <CleanerApplication />
        <aside className="application-aside">
          <Sparkles size={27} />
          <h2>
            A little care.
            <br />
            <span>A lasting impression.</span>
          </h2>
          <p>
            We’re preparing a local network built around clear requests and
            personal connections.
          </p>
          <h3>What happens next?</h3>
          <p>
            Online applications are not open yet. This preview helps you explore
            what we’ll ask for. Nothing is submitted, and there are no jobs or
            earnings guarantees.
          </p>
          <span className="market-tag">GETTING READY FOR A FRESH START</span>
        </aside>
      </div>
    </MarketplaceFrame>
  );
}
