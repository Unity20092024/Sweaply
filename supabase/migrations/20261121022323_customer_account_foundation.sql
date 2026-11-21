-- REVIEW ONLY: apply to the confirmed Sweaply project only after approval.
begin;
create schema if not exists private;
revoke all on schema private from public, anon, authenticated;

-- Future role assignments are trusted backend data, never user-editable metadata.
create table private.user_roles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  role text not null check (role in ('cleaner', 'admin'))
);
revoke all on private.user_roles from public, anon, authenticated;
alter table private.user_roles enable row level security;

create table public.customer_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null default '' check (char_length(display_name) <= 80),
  created_at timestamptz not null default now()
);
create table public.customer_addresses (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null default auth.uid() references public.customer_profiles(id) on delete cascade,
  label text not null default 'Home' check (char_length(label) <= 80),
  line1 text not null check (char_length(line1) between 1 and 200),
  line2 text check (char_length(line2) <= 200),
  city text not null check (char_length(city) between 1 and 100),
  state text not null default 'MN' check (char_length(state) = 2),
  postal_code text not null check (postal_code ~ '^\d{5}(-\d{4})?$'),
  created_at timestamptz not null default now(),
  unique(id, customer_id)
);
create index addresses_customer_idx on public.customer_addresses(customer_id);
create table public.cleaner_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid unique references auth.users(id) on delete set null,
  display_name text not null check (char_length(display_name) between 1 and 80),
  bio text not null default '',
  specialties text[] not null default '{}',
  service_area text not null default '',
  active boolean not null default false,
  created_at timestamptz not null default now()
);
create table public.booking_statuses (
  code text primary key,
  label text not null
);
insert into public.booking_statuses(code, label) values
 ('pending_cleaner_acceptance','Pending Cleaner Acceptance'),
 ('awaiting_confirmation','Awaiting Confirmation'),
 ('confirmed','Confirmed'), ('in_progress','In Progress'),
 ('completed','Completed'), ('cancelled','Cancelled');
create table public.quotes (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references public.customer_profiles(id) on delete cascade,
  address_id uuid,
  service text not null check (service in ('standard','deep','move_out')),
  status text not null default 'requested' check (status in ('requested','estimated','accepted','expired','cancelled')),
  estimate_cents integer check (estimate_cents >= 0),
  created_at timestamptz not null default now(),
  unique(id, customer_id),
  foreign key(address_id, customer_id) references public.customer_addresses(id, customer_id)
);
create index quotes_customer_idx on public.quotes(customer_id, created_at desc);
create index quotes_address_idx on public.quotes(address_id, customer_id);
create table public.bookings (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references public.customer_profiles(id) on delete cascade,
  cleaner_id uuid not null references public.cleaner_profiles(id),
  quote_id uuid,
  address_id uuid,
  service text not null check (service in ('standard','deep','move_out')),
  status text not null default 'pending_cleaner_acceptance' references public.booking_statuses(code),
  scheduled_for timestamptz,
  cleaner_accepted_at timestamptz,
  conditions_met_at timestamptz,
  confirmed_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  unique(id, customer_id),
  foreign key(quote_id, customer_id) references public.quotes(id, customer_id),
  foreign key(address_id, customer_id) references public.customer_addresses(id, customer_id),
  check (status not in ('confirmed','in_progress','completed') or
    (cleaner_accepted_at is not null and conditions_met_at is not null and confirmed_at is not null)),
  check (status <> 'completed' or completed_at is not null)
);
create index bookings_customer_idx on public.bookings(customer_id, created_at desc);
create index bookings_cleaner_idx on public.bookings(cleaner_id);
create index bookings_quote_idx on public.bookings(quote_id, customer_id);
create index bookings_address_idx on public.bookings(address_id, customer_id);
create table public.cleaner_requests (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null default auth.uid() references public.customer_profiles(id) on delete cascade,
  previous_booking_id uuid not null,
  cleaner_id uuid not null references public.cleaner_profiles(id),
  preferred_date date not null,
  status text not null default 'pending_cleaner_acceptance' check
    (status in ('pending_cleaner_acceptance','accepted','declined','cancelled','expired')),
  created_at timestamptz not null default now(),
  foreign key(previous_booking_id, customer_id) references public.bookings(id, customer_id),
  unique(customer_id, previous_booking_id, preferred_date)
);
create index requests_previous_booking_idx on public.cleaner_requests(previous_booking_id, customer_id);
create index requests_cleaner_idx on public.cleaner_requests(cleaner_id);
create index requests_customer_idx on public.cleaner_requests(customer_id, created_at desc);
create table public.cleaner_favorites (
  customer_id uuid not null default auth.uid() references public.customer_profiles(id) on delete cascade,
  cleaner_id uuid not null references public.cleaner_profiles(id),
  created_at timestamptz not null default now(),
  primary key(customer_id, cleaner_id)
);
create index favorites_cleaner_idx on public.cleaner_favorites(cleaner_id);
-- Read foundations only. Messaging and payments integrations are not implemented.
create table public.customer_messages (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references public.customer_profiles(id) on delete cascade,
  subject text not null,
  body text not null,
  created_at timestamptz not null default now()
);
create index messages_customer_idx on public.customer_messages(customer_id, created_at desc);
create table public.payment_receipts (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references public.customer_profiles(id) on delete cascade,
  booking_id uuid not null,
  amount_cents integer not null check(amount_cents >= 0),
  currency text not null default 'USD' check(currency = 'USD'),
  issued_at timestamptz not null default now(),
  foreign key(booking_id, customer_id) references public.bookings(id, customer_id)
);
create index receipts_customer_idx on public.payment_receipts(customer_id, issued_at desc);
create index receipts_booking_idx on public.payment_receipts(booking_id, customer_id);

-- Profile creation has no role assignment. Only a display name comes from metadata.
create function private.initialize_customer() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  insert into public.customer_profiles(id, display_name)
  values(new.id, left(coalesce(new.raw_user_meta_data->>'display_name',''),80));
  return new;
end; $$;
revoke all on function private.initialize_customer() from public, anon, authenticated;
create trigger initialize_customer after insert on auth.users
for each row execute function private.initialize_customer();
-- Existing Auth users also get an empty customer profile, never privileges.
insert into public.customer_profiles(id)
select id from auth.users on conflict(id) do nothing;

-- Always derive the cleaner from an owned completed job. Even direct REST inserts
-- must pass this validation; no client can create an accepted request.
create function private.validate_repeat_request() returns trigger
language plpgsql security invoker set search_path = '' as $$
declare previous public.bookings;
begin
  if auth.uid() is null or new.customer_id <> auth.uid() then
    raise exception 'Request must belong to the signed-in customer' using errcode = '42501';
  end if;
  select * into previous from public.bookings
    where id = new.previous_booking_id and customer_id = auth.uid() and status = 'completed';
  if not found or previous.cleaner_id <> new.cleaner_id then
    raise exception 'An owned completed job with the same cleaner is required' using errcode = '42501';
  end if;
  if new.preferred_date <= (now() at time zone 'America/Chicago')::date then
    raise exception 'Choose a future preferred date' using errcode = '22023';
  end if;
  if new.status <> 'pending_cleaner_acceptance' then
    raise exception 'New requests must await cleaner acceptance' using errcode = '42501';
  end if;
  return new;
end; $$;
revoke all on function private.validate_repeat_request() from public, anon, authenticated;
create trigger validate_repeat_request before insert on public.cleaner_requests
for each row execute function private.validate_repeat_request();

create function public.request_same_cleaner(p_previous_booking_id uuid, p_preferred_date date)
returns uuid language plpgsql security invoker set search_path = '' as $$
declare request_id uuid;
begin
  if auth.uid() is null then raise exception 'Sign in required' using errcode = '42501'; end if;
  insert into public.cleaner_requests(customer_id, previous_booking_id, cleaner_id, preferred_date)
    select auth.uid(), id, cleaner_id, p_preferred_date from public.bookings
    where id = p_previous_booking_id and customer_id = auth.uid() and status = 'completed'
    returning id into request_id;
  if request_id is null then raise exception 'Completed job unavailable' using errcode = '42501'; end if;
  return request_id;
end; $$;
revoke all on function public.request_same_cleaner(uuid, date) from public, anon, authenticated;
grant execute on function public.request_same_cleaner(uuid, date) to authenticated;

-- Explicit grants plus RLS: no reliance on project-specific Data API defaults.
revoke all on public.customer_profiles, public.customer_addresses, public.cleaner_profiles,
 public.booking_statuses, public.quotes, public.bookings, public.cleaner_requests,
 public.cleaner_favorites, public.customer_messages, public.payment_receipts from public, anon, authenticated;
grant usage on schema public to authenticated;
grant select on public.customer_profiles, public.customer_addresses,
 public.booking_statuses, public.quotes, public.bookings, public.cleaner_requests,
 public.cleaner_favorites, public.customer_messages, public.payment_receipts to authenticated;
-- Keep cleaners' linked Auth identities out of the customer Data API.
grant select(id,display_name,bio,specialties,service_area,active,created_at) on public.cleaner_profiles to authenticated;
grant update(display_name) on public.customer_profiles to authenticated;
grant insert(customer_id,label,line1,line2,city,state,postal_code),
 update(label,line1,line2,city,state,postal_code), delete on public.customer_addresses to authenticated;
grant insert(customer_id,previous_booking_id,cleaner_id,preferred_date) on public.cleaner_requests to authenticated;

alter table public.customer_profiles enable row level security;
alter table public.customer_addresses enable row level security;
alter table public.cleaner_profiles enable row level security;
alter table public.booking_statuses enable row level security;
alter table public.quotes enable row level security;
alter table public.bookings enable row level security;
alter table public.cleaner_requests enable row level security;
alter table public.cleaner_favorites enable row level security;
alter table public.customer_messages enable row level security;
alter table public.payment_receipts enable row level security;
create policy own_profile_read on public.customer_profiles for select to authenticated using ((select auth.uid()) = id);
create policy own_profile_update on public.customer_profiles for update to authenticated using ((select auth.uid()) = id) with check ((select auth.uid()) = id);
create policy own_addresses on public.customer_addresses for all to authenticated using ((select auth.uid()) = customer_id) with check ((select auth.uid()) = customer_id);
create policy own_quotes on public.quotes for select to authenticated using ((select auth.uid()) = customer_id);
create policy own_bookings on public.bookings for select to authenticated using ((select auth.uid()) = customer_id);
create policy own_requests_read on public.cleaner_requests for select to authenticated using ((select auth.uid()) = customer_id);
create policy own_requests_insert on public.cleaner_requests for insert to authenticated with check ((select auth.uid()) = customer_id and status = 'pending_cleaner_acceptance');
create policy own_favorites on public.cleaner_favorites for select to authenticated using ((select auth.uid()) = customer_id);
create policy own_messages on public.customer_messages for select to authenticated using ((select auth.uid()) = customer_id);
create policy own_receipts on public.payment_receipts for select to authenticated using ((select auth.uid()) = customer_id);
create policy authenticated_status_labels on public.booking_statuses for select to authenticated using (true);
create policy visible_cleaners on public.cleaner_profiles for select to authenticated using (
 active or exists(select 1 from public.bookings b where b.cleaner_id = cleaner_profiles.id and b.customer_id = (select auth.uid()))
);
-- No customer UPDATE grants on requests/bookings/statuses or write access to roles.
-- Acceptance/confirmation will be a separately reviewed cleaner/admin workflow.
commit;
