# Phase 2 — authentication and customer account foundation

This is an unconnected code/UI foundation, **not functional customer accounts**. Supabase is deliberately disabled; real authentication and all hosted data operations are deferred.

## Source reconciliation

Inspected all three remote branches and searched existing pull requests before implementation:

- `main`: `7c8076e`, approved homepage.
- `feat/sweaply-homepage`: `7c8076e`, same homepage; this is the repository's current default branch.
- `feat/sweaply-branding`: `02b9657`, homepage plus approved original transparent logo.
- No existing pull requests were returned by the GitHub search.

`feat/sweaply-auth-account` starts at `02b9657`. Its draft PR targets `main`, so the diff includes the existing official-logo update as well as Phase 2. No branch was merged, no default branch was changed, and no deployment was created. The homepage sections and global styles are preserved. The existing Sign In control/menu entry now link to the new sign-in page.

## Implemented scope

- `/sign-in`, `/sign-up`, `/forgot-password`, `/reset-password`, and `/account`.
- `/auth/callback` exchanges PKCE codes; `/auth/confirm` verifies email/recovery token hashes. Redirect destinations are allowlisted, never taken from an arbitrary URL.
- Email/password authentication, optional project-configured verification, password reset/update, global sign-out, server-validated account protection.
- Official `SweaplyLogo` in auth and customer layouts. White, lavender, and purple styling with the existing curved visual language.
- Customer overview and seven navigation sections on `/account?section=...`: quotes, bookings, cleaners, favorites, messages, payments, settings. No additional marketplace routes are built.
- Genuine authenticated queries only. Query failures display an unavailable state rather than pretend empty success; new accounts display real empty collections. List views show up to 100 most recent rows. Payment/messaging sections are read-only foundations. Profile display-name updates are enabled; saved addresses are read-only in the UI until booking address management is built.
- Repeat-cleaner requests appear only on completed jobs. The action sends a job ID and preferred date to a database RPC. The database derives the customer and cleaner, verifies job ownership/completion, enforces a future Twin Cities calendar date, and creates only `pending_cleaner_acceptance`. The unique constraint prevents duplicate requests for the same job/date.
- Requests do not create bookings or imply availability. Cleaner acceptance, booking-condition evaluation, and confirmation remain future privileged workflows.

## Current decision — deliberately offline

Sweaply has no Supabase project. **Veriflow and PartSolved must remain completely untouched.** Do not connect either project, create a project/database, link the CLI, or apply migrations. This phase requires no real project or credentials.

`SWEAPLY_SUPABASE_ENABLED` defaults to disabled. The isolated configuration resolver returns `null` before reading any provider values unless that flag is explicitly `true`. Auth clients cannot initialize while it is disabled, including if unrelated URL/key values are accidentally present. `.env.example` leaves all provider values blank and the flag false. The migrations remain prepared SQL only. SQL security tests use an isolated in-memory test harness, not a Supabase project or persistent database.

## Future dedicated-project configuration — not authorized in this phase

The following is a future checklist only, not permission to provision, connect, migrate, or deploy anything now. Once a dedicated Sweaply project and connection are approved:

1. Confirm a dedicated Sweaply development project. Explicitly enable `SWEAPLY_SUPABASE_ENABLED=true` and set `.env.local` (or preview environment settings) from `.env.example` with the actual project URL, **publishable** API key, and exact `SITE_URL`. No service-role/secret key is needed or accepted by the app config. Never commit credentials or enter secret values in chat.
2. Review `supabase/migrations/20261121022323_customer_account_foundation.sql` and the security tests. **The migration has not been applied to any Supabase project. Production application requires explicit approval.** Back up existing data and review the project schema for name collisions first. The migration bootstraps empty profiles for existing Auth users and creates profiles for new users.
3. In Auth, enable the Email provider and password authentication. Disable anonymous signup for this customer flow. Require email confirmation according to the approved launch policy. Set the Supabase password minimum to at least 12 characters, enable appropriate password protections, set Auth rate limits, and configure CAPTCHA if required before public launch. The UI does not invent a CAPTCHA key or provider setup.
4. Set the Site URL to the exact app origin. Allow only approved localhost/preview/production redirect URLs: `/auth/callback` and `/auth/callback?next=/reset-password`. Avoid broad production wildcards. The application rejects non-HTTPS origins except localhost/127.0.0.1 HTTP.
5. Configure SMTP and test actual email delivery. Recommended email templates use token hashes for cross-device operation:

   Signup confirmation link:
   `{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=email`

   Password recovery link:
   `{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=recovery`

   Default PKCE links are also supported through `/auth/callback`; they require the same browser that initiated the request. Keep all tokens out of logs, analytics, and screenshots.

6. Apply the reviewed schema to the approved development project with authorized tooling, check Data API exposure/grants, and run hosted Supabase security advisors. Database grants are explicit rather than relying on project Data API defaults.
7. Verify signup with confirmation on/off as approved, sign-in/out, expired/consumed links, recovery emails, expired-session refresh, invalid/forged cookies, and two-user isolation against the actual project. Approval is still needed before applying migrations or deploying to production.

Without configuration, forms are visibly unavailable and `/account` shows a public setup-pending shell containing **no customer data or simulated identity**. With configuration, the account layout and each data/action entry point validate identity; signed-out users are redirected to sign-in. No authentication bypass, demo user identity/session, or real test credentials are shipped. Development-only UI fixtures are described below and never authenticate.

## Session and authorization design

- All Auth calls run on the server through `@supabase/ssr`. Cookies are HttpOnly, SameSite=Lax, path `/`, and Secure on HTTPS. No browser Auth client reads session cookies. A client is created per request.
- Next.js 16 `proxy.ts` refreshes/verifies claims and preserves cookie writes plus Supabase cache headers. Auth/account responses are private/no-store. Confirmation routes also suppress referrers.
- Account reads and mutations use a server-confirmed `getUser()` identity. React request caching deduplicates validation across the layout/page; no identity is stored in module-level mutable state. Client-supplied account/customer/cleaner IDs are never accepted as authorization.
- Next.js Server Actions enforce the framework's same-origin CSRF checks; no broad allowed-origins override is configured. State-changing account operations are actions, not GET endpoints.
- Profiles, addresses, quotes, cleaners, requests, bookings, statuses, favorites, messages, and receipts have RLS. Customer-owned tables filter on `auth.uid()`. Ownership updates are prevented by column grants and `WITH CHECK` policies.
- Customers cannot change quote estimates, booking/request statuses, receipt amounts, cleaner profiles, or role assignments. Cross-owner address/quote/booking associations have composite foreign keys.
- `private.user_roles` is inaccessible to customers and reserved for future trusted cleaner/admin role assignments. User-editable metadata is used only for a display name, never authorization.
- The private profile-bootstrap trigger is the only `SECURITY DEFINER` function; its search path is fixed, it has no public execute grant, and it assigns no role. The public repeat-request RPC is `SECURITY INVOKER`, authenticated-only, and uses RLS.
- Global sign-out revokes refresh sessions and removes the browser session. Previously issued access tokens may remain valid until expiry; configure a suitably short JWT lifetime. No instant cross-device access-token revocation is claimed.
- Database constraints require cleaner acceptance, booking-condition completion, and a confirmation timestamp before a booking may become confirmed/in-progress/completed. Clients have no booking write privilege.
- Supabase Auth rate limits remain required. Application sign-in messages are generic; password-reset responses do not distinguish existing and unknown email addresses. Passwords/tokens are not logged or returned in form state.

## Verification

```sh
npm ci
npm run lint
npm run typecheck
npm run test:security
npm run build
npm run check:production
npm start
```

The security suite runs the actual SQL migration in isolated in-memory PostgreSQL (PGlite), with a local Auth schema/identity shim and synthetic rows confined to the test process. It does not contact hosted databases. It tests cross-customer isolation, anonymous denial, ownership edits, privilege escalation, repeat-job provenance, wrong-cleaner rejection, duplicates, pending-only requests, and confirmed-booking prerequisites.

Responsive screenshots and machine-readable results are in `docs/screenshots/phase-2/`. The Account capture is explicitly the **unconfigured setup-pending state**, not evidence of a successfully authenticated hosted account. Hosted email delivery, session refresh, and a signed-in dashboard are intentionally not tested or enabled in this offline phase.

## Deferred integrations and features

No payment processor, checkout, card collection, ElevenLabs account, phone number, cleaner acceptance portal, admin console, quote engine, or full marketplace is implemented.

Future AI reception must handle inbound calls, explain services, collect quote information, take callback messages, and transfer complex calls to the owner **only within approved business hours and time zone**. Outside those hours it must take a message instead of transferring. Before activation, approve the phone number, hours, escalation rules, privacy/recording disclosures, consent and retention policy. The receptionist must never turn a cleaner request into a confirmed booking or fabricate availability.

## Results for this delivery

- Lint: passed, no errors or warnings.
- Strict TypeScript: passed.
- Production build and production homepage-content checks: passed.
- Auth validation/redirect tests: passed.
- Local PostgreSQL security/migration suite: 46 checks passed.
- Chromium: 28 route/viewport checks at 360, 375, 390, 430, 768, 1024, and 1440px, plus navigation, password visibility, native email validation, cache-header, invalid-link, and unconfigured-session checks. No horizontal overflow or browser page errors.
- No hosted Supabase sign-up/sign-in, email delivery, session-refresh, or signed-in customer test is claimed. Those remain intentionally deferred until a dedicated project is authorized and configured.

To reproduce browser checks, start an **unconfigured** production build locally (`npm run build && npm start`) and run `npm run test:browser` in another terminal. Install the runner's Chromium with `npx playwright install chromium`, or set `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH` to an existing Chromium binary. `TEST_BASE_URL` defaults to `http://127.0.0.1:3000`. The test intentionally asserts the setup-pending state and does not submit forms to a hosted Auth provider. Configured-account end-to-end tests are a separate required follow-up.

## Offline UI previews

Use a local development server with these flags (no Supabase values are required):

```sh
SWEAPLY_SUPABASE_ENABLED=false SWEAPLY_ENABLE_ACCOUNT_PREVIEW=true npm run dev -- --port 3001
```

- `/sign-in`, `/sign-up`, and `/forgot-password` retain disabled real submit buttons and explicitly state that accounts are not functional. A **DEVELOPMENT DEMO · VALIDATION ONLY** control checks fields locally. It does not sign in, create accounts, send emails, or submit a server action.
- `/dev/account` renders the same dashboard presentation component with empty UI fixtures and a persistent **DEVELOPMENT DEMO · NOT A REAL ACCOUNT** notice. Every navigation section is available for layout testing. No fake authenticated user or session is supplied.
- `/dev/account?section=bookings&scenario=completed` adds one explicitly fictional completed-job/cleaner fixture. The date control and local preview button demonstrate the future pending-acceptance explanation. The preview never calls the repeat-request action or database RPC and never says a request was sent.
- Profile save/password-management actions are unavailable in the demo. Preview links stay in the development route. The real `/account` remains a setup-pending page until a future connection is authorized.
- `/dev/account` returns **404 in production**, even if `SWEAPLY_ENABLE_ACCOUNT_PREVIEW=true`. It also returns 404 in development unless explicitly enabled, and is unavailable whenever Supabase integration is enabled.

Run `npm run test:demo` against the development server (`TEST_BASE_URL` defaults to `http://localhost:3001`; optionally set `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH`). It checks navigation/empty sections, local validation, the fictional repeat-request control, and zero POST requests, provider calls, or auth-session cookies. `npm run test:browser` remains the production/unconfigured suite and additionally checks that production cannot expose the development route. Screenshots/results for demos are in `docs/screenshots/phase-2/offline/`.

## Offline continuation results

- 32 development dashboard viewport/section checks passed at 360, 390, 430, and 1440px.
- Local-only auth validation and fictional repeat-request preview passed with zero POST requests, provider requests, or auth-session cookies.
- Production still passes 28 route/viewport checks, and `/dev/account` returns 404 even with the preview flag enabled.
- The connection-disable gate, auth validation/redirect tests, and 46 isolated SQL security checks pass.
- No Supabase project was contacted, linked, created, or migrated during this continuation. No production deployment or branch merge was performed.
