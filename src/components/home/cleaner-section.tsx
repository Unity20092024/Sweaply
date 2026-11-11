import { ArrowUpRight, MapPin, Sparkles, UsersRound } from "lucide-react";
import { CleanerCarousel } from "@/components/cleaners/cleaner-carousel";
import { developmentCleaners, liveCleaners } from "@/lib/cleaners";
import { LaunchAction } from "./launch-action";
export function CleanerSection() {
  return (
    <section id="cleaners" className="cleaner-section">
      <div className="container">
        <div className="section-heading">
          <div>
            <span className="eyebrow">
              <Sparkles size={15} /> A CLEAN HOME. A HUMAN CONNECTION.
            </span>
            <h2>
              The Cleaner <span>Request Area</span>
            </h2>
            <p>
              Browse cleaning professionals, explore their specialties, and
              request your favorite cleaner.
            </p>
          </div>
          <span className="section-index">01 / YOUR PEOPLE</span>
        </div>
        {liveCleaners.length ? (
          <CleanerCarousel cleaners={liveCleaners} />
        ) : (
          <div className="network-empty">
            <div className="network-art" aria-hidden="true">
              <span className="orbit orbit-one" />
              <span className="orbit orbit-two" />
              <div className="people-mark">
                <UsersRound size={43} strokeWidth={1.2} />
              </div>
              <Sparkles className="art-spark" size={25} />
              <span className="location-chip">
                <MapPin size={13} /> TWIN CITIES
              </span>
            </div>
            <div className="network-copy">
              <span className="mini-label">
                LOCAL PEOPLE. FRESH POSSIBILITIES.
              </span>
              <h3>
                Meet your future
                <br />
                favorite cleaner.
              </h3>
              <p>Our local cleaner network is growing.</p>
              <LaunchAction
                title="Make a fresh start with Sweaply."
                message="Cleaner applications aren’t open just yet. We’re preparing our Twin Cities network; check back for application details."
                variant="outline"
              >
                Become a Sweaply Cleaner
              </LaunchAction>
            </div>
            <ArrowUpRight
              className="empty-arrow"
              size={38}
              strokeWidth={1}
              aria-hidden="true"
            />
          </div>
        )}
        <p className="acceptance-note">
          A personal connection, at your pace. All cleaner requests require
          acceptance.
        </p>
        {process.env.NODE_ENV === "development" && (
          <details className="development-preview">
            <summary>
              Development preview · sample profiles, not real cleaners
            </summary>
            <p>
              For interaction testing only. This preview is excluded from
              production.
            </p>
            <CleanerCarousel cleaners={developmentCleaners} />
          </details>
        )}
      </div>
    </section>
  );
}
