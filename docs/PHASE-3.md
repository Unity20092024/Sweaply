# Phase 3 — cleaner marketplace frontend

## Delivery and boundaries

Branch: `feat/sweaply-cleaner-marketplace`, created directly from Phase 2 commit `32711f8`. The new draft PR is stacked against `feat/sweaply-auth-account` (PR #1) to isolate Phase 3 changes. PR #1 is not merged; main, the repository default branch, and production deployment remain unchanged.

Supabase stays disabled. No Supabase tools, project connections, databases, migrations, API keys, payments, or ElevenLabs integrations are added or used. Veriflow and PartSolved remain untouched. Existing Phase 2 SQL and session foundations remain unchanged; no real submissions are available.

## Public surfaces

- The Cleaner Request Area stays immediately below the existing homepage hero/benefits. The hero and remaining homepage content are preserved. Its application CTA and the existing footer link now open `/become-a-cleaner`.
- Until approved genuine profiles exist, production shows the established lavender cleaner-network empty state. The approved-profile selector rejects fixture profiles, including fixtures accidentally marked approved.
- Cleaner cards support local portrait images, names, specialties, service area, evidence-backed ratings, swipe/scroll snap, keyboard arrows, previous/next controls, responsive sizes, and reduced motion. Controls disable at scroll boundaries or when all cards fit.
- The profile modal is a near-full-screen mobile native dialog with an accessible name, sticky close control, Escape handling, focus containment/return, and background scroll locking. It supports biography/experience, genuine top-three reviews, and permission-confirmed gallery items. Missing evidence has explicit empty states.
- Reviews require a verified flag and are sorted by genuine star score before taking three. Ratings require verified evidence and valid average/count. Galleries require permission confirmation. Fixture profiles never display fabricated reviews, ratings, or work evidence. These flags define a future trusted data contract; they do not replace backend verification or authorization.
- Request This Cleaner opens service/date/optional-notes fields inside the dialog. Real calendar/future-date validation precedes a local review. Pending Cleaner Acceptance is explained as the mandatory future starting state. The final submit control is disabled, and nothing is sent, stored, accepted, or confirmed. No availability is inferred.
- `/become-a-cleaner` is a complete application UI: name, email, optional phone, experience, approach, specialties, service areas, preferred days/time, optional self-reported insurance status, validation, and local review. It collects no documents or policy numbers. Real submission is disabled. Fields live only in page memory; there is no form action, fetch, server action, browser storage, or upload.
- `/cleaner/dashboard` is an honest public unavailable state. It contains no fake identity, jobs, requests, availability, or functioning cleaner login.

## Development previews

```sh
SWEAPLY_SUPABASE_ENABLED=false SWEAPLY_ENABLE_MARKETPLACE_PREVIEW=true npm run dev -- --port 3001
```

- `/dev/marketplace`: labeled stock-model profile fixtures, carousel, profile modal, and request review.
- The homepage also includes a collapsed, explicitly labeled development carousel when this same flag is enabled.
- `/dev/cleaner`: labeled cleaner workspace demonstration for My Profile, Incoming Requests, Accept/Decline, My Jobs, Availability, Completion Checklist, and Before-and-After Gallery.
- Demo acceptance produces **Awaiting Confirmation**, never Confirmed. No real booking is created. Declining never notifies a customer. Profile and availability controls only explain the local preview; checklist completion never marks a real job complete.
- Gallery controls accept only JPEG/PNG/WebP up to 5 MB, use temporary blob URLs in browser memory, and show a comparison only after both images and explicit ownership/customer-permission confirmation. No image uploads or publication exist. URLs are revoked on replacement/unmount. Use non-sensitive synthetic images; no addresses or identifying details. Future real uploads require server-side validation, authorization, metadata handling, and customer consent review.
- All demo state resets on reload. There are no auth-session cookies or saved accounts. Demo routes return 404 outside development, without the explicit preview flag, or whenever Supabase is enabled.

The stock portraits are illustrative models, not Sweaply professionals. Every card/modal is labeled accordingly; no names, ratings, reviews, bookings, or availability are represented as real. See `ASSETS.md` for sources.

## Verification

```sh
npm run lint
npm run typecheck
npm run test:marketplace:rules
node scripts/test-auth-security.mjs
npm run build
npm run check:production
npm start
# In another terminal, against the unconnected production server:
npm run test:marketplace
```

For development UI checks, start the preview server above, then:

```sh
MARKETPLACE_TEST_MODE=development npm run test:marketplace
```

The runner uses Playwright Chromium. Install it with `npx playwright install chromium`, or set `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH` to an existing Chromium executable. `TEST_BASE_URL` defaults to `http://127.0.0.1:3000` for production or `http://localhost:3001` for development. No hosted Auth or database is contacted.

Tests cover production fixture exclusion, 404 preview isolation even with the preview flag set, real dates, approved-profile and review/rating/gallery evidence guards, carousel controls/keyboard/native touch, dialog focus/Escape/scroll lock, local request/application review, acceptance without confirmation, decline, availability, checklist and permission-gated local gallery. Browser tests assert zero POSTs, provider requests, and runtime errors.

Responsive sweeps: 360, 375, 390, 430, 768, 1024, and 1440px, with mobile Chromium/touch emulation. No physical Android device test is claimed. 390px screenshots and machine-readable results are in `docs/screenshots/phase-3/`. Developer-toolbar overlays are hidden only in screenshots, not product code.

## Intentionally deferred

Actual cleaner approval, application processing/storage, authentication/cleaner roles, live availability, customer-to-cleaner requests, acceptance notifications, scheduling, confirmation, job completion, gallery uploads/moderation, payments, and production deployment. No further marketplace phases are implemented. A dedicated, approved Sweaply backend and authorization review are required before these operations can become functional.

## Delivery verification results

- Lint and strict TypeScript: passed.
- Production build and production-content/route-scope checks: passed.
- Marketplace domain/evidence/date/status rules and existing auth connection-disable/validation checks: passed.
- Production browser suite: 21 public-route/viewport checks plus local application validation/review and production preview-route denial. Zero POSTs, provider requests, and browser runtime errors.
- Development browser suite: 14 route/viewport checks plus all six workspace sections, emulated native finger swipe, carousel controls/keyboard, modal focus containment/Escape/body lock, request review, acceptance without confirmation, decline, availability, checklist completion preview, consent-gated local images, and reset-on-reload. Zero POSTs, provider requests, and browser runtime errors.
- Additional checks: Back to Profile restores modal focus; Escape restores the opening card; the production homepage’s cleaner empty state follows the hero/benefits in the original DOM order.
- Mobile profile/request, application, cleaner workspace, checklist, gallery empty state, and homepage-empty screenshots were captured at 390px. Key mobile screenshots were visually inspected and adjusted for portrait crop and non-overlapping request headings.
- Physical Android hardware, real customers/cleaners, hosted authentication, actual submissions, real acceptance/confirmation, and uploaded galleries were not tested or enabled. This is an offline frontend phase only.
