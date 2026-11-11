# Sweaply

Mobile-first homepage for a Minneapolis–St. Paul residential cleaning platform. Next.js App Router, TypeScript, Tailwind CSS 4, and Lucide icons. Only the homepage is implemented.

## Run locally

Requires Node.js 20.9 or newer.

```sh
npm ci
npm run dev
```

Open http://localhost:3000. Development mode includes a clearly labeled, collapsed sample-profile carousel for exercising profiles, keyboard navigation, and the modal. These fixtures are absent from the production-rendered homepage.

```sh
npm run lint
npm run typecheck
npm run build
npm run check:production
npm start
```

## Honest launch state

`src/lib/cleaners.ts` contains the empty verified-profile collection and typed development fixtures. Production displays the local-network empty state. No ratings, testimonials, fixed prices, phone number, or confirmed bookings are invented. Estimates, service details, and cleaner applications open launch-information dialogs; they send nothing. Sign-in and phone actions are disabled. Planned pages are listed in `docs/ROADMAP.md`.

## Structure

- `src/app`: homepage, metadata, shared responsive styles
- `src/components/layout`: header, navigation, footer
- `src/components/home`: cleaner section and launch information dialog
- `src/components/cleaners`: typed cards, swipe carousel, native accessible profile modal
- `src/lib`: cleaner contracts and development fixtures
- `public/images`: local temporary photography; see `docs/ASSETS.md`

## Vercel

Import this repository as a Next.js project using the default build (`npm run build`). No environment variables or external integrations are required. This change does not create or modify a deployment.

## Accessibility

Semantic landmarks, skip link, visible focus, native dialogs with Escape and modal focus containment, return focus, background scroll locking, reduced-motion support, safe-area modal spacing, keyboard and swipe carousel navigation. The mobile menu uses normal document navigation and returns focus to its trigger on Escape.
