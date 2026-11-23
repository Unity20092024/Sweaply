# SWEAPLY — route roadmap

## Implemented

- Homepage `/` with the approved design and official logo.
- Authentication: `/sign-in`, `/sign-up`, `/forgot-password`, `/reset-password`.
- Auth support endpoints: `/auth/callback`, `/auth/confirm`.
- Customer foundation: `/account`, with query-selected overview, quotes, bookings, cleaners, favorites, messages, payments, and settings sections.

Authentication/account functionality requires the confirmed Sweaply Supabase project, environment configuration, and approved migrations described in `PHASE-2.md`. No hosted Supabase project has been changed.

## Phase 3 implemented

`/become-a-cleaner` (local application review, no submission) and `/cleaner/dashboard` (honest disconnected state). Development-only `/dev/marketplace` and `/dev/cleaner` provide labeled UI fixtures; they return 404 in production. See `PHASE-3.md`. No Supabase project is connected.

## Future public pages

`/services`, `/cleaners`, `/how-it-works`, `/about`, `/blog`, `/contact`, `/help`, `/service-areas`, `/privacy`, `/terms`, `/cancellation-policy`.

Existing homepage navigation uses valid in-page sections. Unbuilt public pages remain visibly unavailable; no completed pages are implied.

## Future customer subroutes

`/account/quotes`, `/account/bookings`, `/account/cleaners`, `/account/favorites`, `/account/messages`, `/account/payments`, `/account/settings`.

These may later become dedicated routes. The current foundation displays these sections inside `/account?section=...` rather than shipping unfinished subpages.

## Future cleaner and admin portals

`/cleaner/requests`, `/cleaner/jobs`, `/cleaner/profile`, `/admin`.

Cleaner/admin role assignments are reserved in a private database table with no customer grants. Cleaner acceptance and administrative workflows are not implemented.

## Future features

Reviews, full quote/booking flows, address editing, favorites management, messaging, and online payments are deferred. Repeat-cleaner requests from completed jobs are prepared in Phase 2 and must remain pending until the selected cleaner accepts and booking requirements are met. A request is never a confirmed booking.

Supabase Auth and customer data access are implemented but await project configuration and migration approval. Payments and ElevenLabs reception are not integrated. Future reception requires an approved number, hours/time zone, callback handling, privacy policy, and owner transfer rules; never transfer outside approved hours. See `PHASE-2.md`.
