# Sweaply

Mobile-first homepage for a Minneapolis–St. Paul residential cleaning platform. Next.js App Router, TypeScript, Tailwind CSS 4, and Lucide icons. The approved homepage is preserved. Phase 2 adds server-side Supabase authentication and customer-account foundations. See [Phase 2 setup and security](docs/PHASE-2.md).

## Run locally

Use Node.js 24 LTS for the development/security-test toolchain.

```sh
npm ci
npm run dev
```

Open http://localhost:3000. With `SWEAPLY_ENABLE_MARKETPLACE_PREVIEW=true`, development mode includes a clearly labeled, collapsed sample-profile carousel for exercising profiles, keyboard navigation, and the modal. These fixtures are absent from the production-rendered homepage.

```sh
npm run lint
npm run typecheck
npm run test:security
npm run build
npm run check:production
npm start
```

## Honest launch state

`src/lib/cleaners.ts` contains the empty verified-profile collection and typed development fixtures. Production displays the local-network empty state. No ratings, testimonials, fixed prices, phone number, or confirmed bookings are invented. Estimates, service details, and cleaner applications open launch-information dialogs; they send nothing. Sign-in links to the new auth pages; phone support remains disabled. Supabase integration is disabled by default with `SWEAPLY_SUPABASE_ENABLED=false`. No real authentication or customer accounts are functional in this offline phase. Do not connect existing projects, provision a database, or apply the prepared migrations. Planned pages are listed in `docs/ROADMAP.md`.

## Structure

- `src/app`: homepage, metadata, shared responsive styles
- `src/components/layout`: header, navigation, footer
- `src/components/home`: cleaner section and launch information dialog
- `src/components/cleaners`: typed cards, swipe carousel, native accessible profile modal
- `src/lib`: cleaner contracts and development fixtures
- `public/images`: local temporary photography; see `docs/ASSETS.md`

## Vercel

Import this repository as a Next.js project using the default build (`npm run build`). The homepage works without environment variables. Auth and account access require the reviewed Supabase configuration described in `docs/PHASE-2.md`. This change does not create or modify a deployment.

## Accessibility

Semantic landmarks, skip link, visible focus, native dialogs with Escape and modal focus containment, return focus, background scroll locking, reduced-motion support, safe-area modal spacing, keyboard and swipe carousel navigation. The mobile menu uses normal document navigation and returns focus to its trigger on Escape.

## Offline development preview

```sh
SWEAPLY_SUPABASE_ENABLED=false SWEAPLY_ENABLE_ACCOUNT_PREVIEW=true npm run dev -- --port 3001
```

Open `/dev/account` for the labeled UI-only dashboard or `/dev/account?section=bookings&scenario=completed` for the fictional repeat-cleaner fixture. Auth pages offer local validation checks, with real submit actions disabled. There is no demo login or simulated successful authentication. Previews return 404 in production. Run `npm run test:demo` against this development server. See `docs/PHASE-2.md` for controls, screenshots, and the future connection checklist.

## Phase 3 cleaner marketplace

The homepage cleaner section, profile modal, local request-review workflow, `/become-a-cleaner` application preview, and disconnected `/cleaner/dashboard` are implemented. Real requests and applications cannot be submitted. Supabase remains disabled; no project or database is contacted.

```sh
SWEAPLY_SUPABASE_ENABLED=false SWEAPLY_ENABLE_MARKETPLACE_PREVIEW=true npm run dev -- --port 3001
```

Use `/dev/marketplace` and `/dev/cleaner` for labeled development fixtures. These routes return 404 in production. Run `npm run test:marketplace:rules`, production `npm run test:marketplace`, or development `MARKETPLACE_TEST_MODE=development npm run test:marketplace`. See [Phase 3 scope, safety, and screenshots](docs/PHASE-3.md).
