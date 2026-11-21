# Homepage verification

## Passed

- `npm run lint`: no errors or warnings.
- `npm run typecheck`: strict TypeScript passes.
- `npm run build`: Next.js production build passes; `/` is prerendered.
- `npm run check:production`: checks generated HTML for development fixture leakage, required homepage sections, all four local image references, and homepage-only route scope.
- All four downloaded assets are valid JPEG images; source and temporary status are documented in `ASSETS.md`.

The initial sandboxed build was blocked because Turbopack needs a worker port. The same production build passed with approved execution outside that sandbox.

## Requires browser review

No callable `cua_repl.js` browser tool is exposed in this session. The managed Sites skill explicitly directs skipping browser QA in that case, without starting another browser or preview route. Consequently, screenshots and browser interaction tests have not been performed, and no visual match or overflow result is claimed.

Review at 360, 375, 390, 430, 768, 1024, and 1440 pixels:

- Menu open/close, links, keyboard order, Escape return focus.
- Estimate/application/service launch dialogs: focus containment, Escape, backdrop, return focus, background scroll lock.
- Development-only profile carousel: touch swipe, controls, arrow keys, scrolling; profile modal: close, focus, safe areas, scroll lock, future request notice.
- No horizontal document overflow, no overlapping content, no clipped labels, responsive image crops.
- Reduced-motion preference; keyboard focus visibility and mobile touch targets.
- Production mode displays only the honest cleaner-network empty state.

## Delivery environment

The repository was empty, with no commit or `main` ref. The requested feature branch is the initial branch. Creating a PR against `main` requires an existing base branch; no commit is pushed to `main` in this task.

## Official logo update — browser verification

The subsequent branding update was verified with the environment's installed Chromium and Playwright against a local production server. This supersedes the earlier browser limitation for the logo checks below; it does not claim a full regression test of all homepage features.

- Production build, lint, TypeScript, and existing production-content checks pass.
- At 360, 390, 430, 768, 1024, and 1440px: both logos load, retain the 3:1 ratio, use `object-fit: contain`, and have the approved alternative text.
- No header action overlap, horizontal page overflow, or browser page errors at those widths. Navigation still opens and closes.
- Original PNG served with HTTP 200; response SHA-256 matches the supplied ZIP asset exactly. Original RGBA transparency preserved with no image modifications.
- Screenshots of header and footer at 360, 390, 430, and 1440px are in `docs/screenshots/branding/`. Mobile header/footer and desktop header screenshots were visually inspected.
- Machine-readable measurements are in `docs/screenshots/branding/results.json`.

Only the shared logo, its CSS, and branding documentation/assets changed. Homepage content, cards, booking buttons, section layouts, and curves are unchanged. Authentication pages remain unbuilt; their future implementation can reuse `SweaplyLogo`.

## Phase 2

For the authentication/customer-account implementation, current verification, required configuration, and the explicit hosted-auth test limitation, see `PHASE-2.md` and `screenshots/phase-2/results.json`. Phase 1 homepage-only scope notes above describe the earlier delivery.
