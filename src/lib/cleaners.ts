export type Cleaner = {
  id: string;
  name: string;
  portrait?: string;
  specialties: string[];
  area: string;
  bio: string;
  experience?: string;
  reviews: { quote: string; author: string }[];
  rating?: { average: number; count: number };
  gallery?: { src: string; alt: string; permissionConfirmed: true }[];
  isFixture?: boolean;
};
// No verified profiles are available for launch. Never populate with invented data.
export const liveCleaners: Cleaner[] = [];
// Loaded only in development; never included in a production-rendered page.
export const developmentCleaners: Cleaner[] = [
  "Standard",
  "Deep",
  "Move-out",
].map((service, i) => ({
  id: `fixture-${i}`,
  name: `Demo cleaner ${i + 1}`,
  specialties: [`${service} cleaning`],
  area: "Twin Cities · demonstration only",
  bio: "Development fixture for testing the profile layout. This is not a real cleaner and cannot be booked.",
  reviews: [],
  isFixture: true,
}));
