import "server-only";
import type { Cleaner } from "./cleaners";
// Stock models are NOT Sweaply professionals. No ratings, reviews or job evidence.
export const developmentCleaners: Cleaner[] = [
  {
    name: "Demo cleaner A.",
    portrait: "/images/demo-cleaners/portrait-a.jpg",
    specialties: ["Standard cleaning", "Deep cleaning"],
    area: "Minneapolis · demonstration only",
  },
  {
    name: "Demo cleaner B.",
    portrait: "/images/demo-cleaners/portrait-b.jpg",
    specialties: ["Move-out cleaning", "Deep cleaning"],
    area: "St. Paul · demonstration only",
  },
  {
    name: "Demo cleaner C.",
    portrait: "/images/demo-cleaners/portrait-c.jpg",
    specialties: ["Standard cleaning", "Move-out cleaning"],
    area: "Twin Cities · demonstration only",
  },
].map((profile, i) => ({
  ...profile,
  id: `fixture-${i}`,
  bio: "Development profile for exploring the Sweaply experience. The portrait is a stock model, not a Sweaply cleaner. No services or availability are offered by this demonstration.",
  experience: "Example experience field — not a verified work history",
  reviews: [],
  isFixture: true,
}));
