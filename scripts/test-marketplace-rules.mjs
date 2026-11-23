import assert from "node:assert/strict";
import {
  approvedCleaners,
  authorizedGallery,
  topReviews,
  verifiedRating,
} from "../src/lib/cleaners.ts";
import { futureDate, demoDecision } from "../src/lib/marketplace.ts";
const base = {
  id: "test",
  name: "Unit-only fixture",
  bio: "Test",
  area: "Test",
  specialties: [],
  reviews: [],
};
assert.deepEqual(
  approvedCleaners([base, { ...base, approved: true, isFixture: true }]),
  [],
);
assert.equal(approvedCleaners([{ ...base, approved: true }]).length, 1);
assert.equal(
  verifiedRating({
    ...base,
    rating: { average: 4.8, count: 12, verified: false },
  }),
  undefined,
);
assert.equal(
  verifiedRating({
    ...base,
    isFixture: true,
    rating: { average: 4.8, count: 12, verified: true },
  }),
  undefined,
);
assert.equal(
  verifiedRating({
    ...base,
    rating: { average: 4.8, count: 12, verified: true },
  }).count,
  12,
);
const reviews = [1, 2, 3, 4, 5].map((n) => ({
  quote: "Unit test only",
  author: "Test",
  stars: n,
  verified: true,
}));
assert.deepEqual(
  topReviews({
    ...base,
    reviews: [...reviews, { stars: 5, verified: false }],
  }).map((r) => r.stars),
  [5, 4, 3],
);
assert.equal(topReviews({ ...base, isFixture: true, reviews }).length, 0);
assert.deepEqual(
  authorizedGallery({ ...base, gallery: [{ permissionConfirmed: false }] }),
  [],
);
assert.equal(
  authorizedGallery({
    ...base,
    gallery: [{ src: "unit", alt: "Test", permissionConfirmed: true }],
  }).length,
  1,
);
assert.equal(
  authorizedGallery({
    ...base,
    isFixture: true,
    gallery: [{ permissionConfirmed: true }],
  }).length,
  0,
);
assert.equal(futureDate("2030-01-15", new Date("2026-11-23T12:00:00Z")), true);
for (const date of ["2026-02-31", "2026-11-22", "2026-11-23", "not-a-date"])
  assert.equal(futureDate(date, new Date("2026-11-23T12:00:00Z")), false);
assert.equal(
  demoDecision("pending_cleaner_acceptance", "accept"),
  "accepted_awaiting_confirmation",
);
assert.equal(demoDecision("pending_cleaner_acceptance", "decline"), "declined");
assert.notEqual(
  demoDecision("pending_cleaner_acceptance", "accept"),
  "confirmed",
);
console.log(
  "PASS: approved-profile filtering, verified review/rating evidence, gallery permission, real calendar dates, and acceptance without confirmation.",
);
