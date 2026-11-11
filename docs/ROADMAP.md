# SWEAPLY — planned routes

Only `/` is implemented. In-page navigation points at existing homepage sections. Other navigation labels are non-interactive and announced as coming soon. No placeholder route pretends to be a completed page.

Public: `/services`, `/cleaners`, `/how-it-works`, `/about`, `/blog`, `/contact`, `/help`, `/service-areas`, `/become-a-cleaner`, `/privacy`, `/terms`, `/cancellation-policy`.

Authentication: `/sign-in`, `/sign-up`, `/forgot-password`.

Customer account: `/account`, `/account/quotes`, `/account/bookings`, `/account/cleaners`, `/account/favorites`, `/account/messages`, `/account/payments`, `/account/settings`.

Cleaner portal: `/cleaner/dashboard`, `/cleaner/requests`, `/cleaner/jobs`, `/cleaner/profile`.

Administration: `/admin`.

Future accounts will include previous quotes, completed jobs, upcoming appointments, genuine reviews, and Request Same Cleaner. All requests (including repeat requests) remain pending until the selected cleaner accepts. A request is never a confirmed booking.

Later integrations: Supabase, payments, and ElevenLabs inbound reception. Phone support will require an approved number, hours, callback handling, and owner transfer rules. Never transfer outside approved hours. No integrations or secrets are included in this phase.
