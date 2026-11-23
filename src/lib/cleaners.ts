export type Cleaner = {
  id: string;
  name: string;
  portrait?: string;
  specialties: string[];
  area: string;
  bio: string;
  experience?: string;
  approved?: boolean;
  isFixture?: boolean;
  reviews: { quote: string; author: string; stars: number; verified: true }[];
  rating?: { average: number; count: number; verified: true };
  gallery?: { src: string; alt: string; permissionConfirmed: true }[];
};
// Offline foundation. No approved real profiles have been provided.
export const liveCleaners: Cleaner[] = [];
export function approvedCleaners(cleaners: Cleaner[]) {
  return cleaners.filter((c) => c.approved === true && !c.isFixture);
}
export function verifiedRating(cleaner: Cleaner) {
  const r = cleaner.rating;
  return !cleaner.isFixture &&
    r?.verified === true &&
    Number.isInteger(r.count) &&
    r.count > 0 &&
    r.average >= 1 &&
    r.average <= 5
    ? r
    : undefined;
}
export function topReviews(cleaner: Cleaner) {
  return cleaner.isFixture
    ? []
    : cleaner.reviews
        .filter((r) => r.verified === true && r.stars >= 1 && r.stars <= 5)
        .sort((a, b) => b.stars - a.stars)
        .slice(0, 3);
}
export function authorizedGallery(cleaner: Cleaner) {
  return cleaner.isFixture
    ? []
    : (cleaner.gallery ?? []).filter((p) => p.permissionConfirmed === true);
}
