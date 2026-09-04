-- 1st Class Express — Freight Quote & Customer Onboarding System
-- Phase 2/3 schema: quotes, quote_items, customer_applications, quote_events,
-- and the transaction-safe 1STCE reference sequence.
--
-- Design notes:
--  * All customer-facing writes go through SECURITY DEFINER RPCs / server APIs
--    using the service role. RLS denies all direct access to anon/authenticated
--    by default; admin reads are granted to authenticated users on an email
--    allowlist (see is_admin()).
--  * reference_number is generated server-side from a dedicated sequence and has
--    a UNIQUE constraint. It never changes for the life of a job.
--  * Server-side totals are authoritative; browser-sent totals are ignored.

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- 1STCE reference sequence  ->  1STCE-000001, 1STCE-000002, ...
-- ---------------------------------------------------------------------------
create sequence if not exists public.onestce_quote_sequence
  as bigint
  start with 1
  increment by 1
  minvalue 1
  no cycle;

create or replace function public.next_onestce_reference()
  returns text
  language sql
  volatile
as $$
  select '1STCE-' || lpad(nextval('public.onestce_quote_sequence')::text, 6, '0');
$$;

-- ---------------------------------------------------------------------------
-- Enums
-- ---------------------------------------------------------------------------
do $$ begin
  create type public.quote_status as enum (
    'new', 'reviewing', 'quoted', 'accepted', 'booked',
    'in_transit', 'delivered', 'on_hold', 'declined', 'cancelled'
  );
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.application_status as enum (
    'pending_review', 'approved', 'declined', 'on_hold'
  );
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.au_state as enum ('NSW','VIC','QLD','SA','WA','TAS','ACT','NT');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.service_priority as enum (
    'urgent', 'next_business_day', 'three_to_five_days', 'specific_date'
  );
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.delivery_authority as enum ('atl', 'signature_required');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.freight_item_type as enum (
    'pallet', 'box', 'carton', 'crate', 'skid', 'machinery', 'other'
  );
exception when duplicate_object then null; end $$;

-- ---------------------------------------------------------------------------
-- updated_at trigger helper
-- ---------------------------------------------------------------------------
create or replace function public.set_updated_at()
  returns trigger language plpgsql as $$
begin
  new.updated_at := now();
  return new;
end $$;

-- ---------------------------------------------------------------------------
-- quotes
-- ---------------------------------------------------------------------------
create table if not exists public.quotes (
  id                          uuid primary key default gen_random_uuid(),
  reference_number            text not null unique,
  status                      public.quote_status not null default 'new',
  created_at                  timestamptz not null default now(),
  updated_at                  timestamptz not null default now(),

  -- idempotency: same key within the retention window returns the same quote
  idempotency_key             text unique,

  customer_company            text,
  customer_name               text not null,
  customer_email              text not null,
  customer_phone              text not null,
  preferred_contact_method    text,
  customer_reference          text,
  customer_notes              text,

  pickup_address_line_1       text not null,
  pickup_address_line_2       text,
  pickup_suburb               text not null,
  pickup_state                public.au_state not null,
  pickup_postcode             text not null,
  pickup_contact_name         text not null,
  pickup_contact_phone        text not null,
  pickup_date                 date not null,
  pickup_ready_time           time,
  pickup_cutoff_time          time not null,
  pickup_notes                text,

  delivery_address_line_1     text not null,
  delivery_address_line_2     text,
  delivery_suburb             text not null,
  delivery_state              public.au_state not null,
  delivery_postcode           text not null,
  delivery_contact_name       text not null,
  delivery_contact_phone      text not null,
  requested_delivery_date     date,
  delivery_cutoff_time        time not null,
  delivery_notes              text,

  pickup_tailgate_required        boolean not null default false,
  pickup_forklift_available       boolean not null default false,
  pickup_loading_dock_available   boolean not null default false,
  pickup_customer_loads           boolean not null default false,

  delivery_tailgate_required      boolean not null default false,
  delivery_forklift_available     boolean not null default false,
  delivery_loading_dock_available boolean not null default false,
  delivery_receiver_unloads       boolean not null default false,

  service_priority            public.service_priority not null,
  service_specific_date       date,
  delivery_authority          public.delivery_authority not null,
  atl_instructions            text,

  total_items                 integer not null default 0,
  total_weight_kg             numeric(12,2) not null default 0,
  total_volume_m3             numeric(12,4) not null default 0,

  terms_accepted              boolean not null default false,
  terms_version               text not null,
  terms_accepted_at           timestamptz,

  quoted_price                numeric(12,2),
  quoted_price_gst            numeric(12,2),
  quote_sent_at               timestamptz,
  quote_accepted_at           timestamptz,

  -- secure customer acceptance link (never the bare reference)
  respond_token               text unique default encode(gen_random_bytes(32), 'hex'),

  carrier_name                text,
  carrier_consignment_number  text,

  internal_notes              text,

  constraint quotes_atl_needs_instructions
    check (delivery_authority <> 'atl' or atl_instructions is not null),
  constraint quotes_specific_date_present
    check (service_priority <> 'specific_date' or service_specific_date is not null),
  constraint quotes_totals_non_negative
    check (total_items >= 0 and total_weight_kg >= 0 and total_volume_m3 >= 0)
);

create index if not exists quotes_status_idx        on public.quotes (status);
create index if not exists quotes_created_at_idx    on public.quotes (created_at desc);
create index if not exists quotes_customer_email_idx on public.quotes (lower(customer_email));
create index if not exists quotes_pickup_suburb_idx  on public.quotes (lower(pickup_suburb));
create index if not exists quotes_delivery_suburb_idx on public.quotes (lower(delivery_suburb));

drop trigger if exists quotes_set_updated_at on public.quotes;
create trigger quotes_set_updated_at before update on public.quotes
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- quote_items
-- ---------------------------------------------------------------------------
create table if not exists public.quote_items (
  id              uuid primary key default gen_random_uuid(),
  quote_id        uuid not null references public.quotes(id) on delete cascade,
  item_type       public.freight_item_type not null,
  description     text,
  quantity        integer not null check (quantity > 0 and quantity <= 10000),
  length_cm       numeric(10,2) not null check (length_cm > 0 and length_cm <= 10000),
  width_cm        numeric(10,2) not null check (width_cm  > 0 and width_cm  <= 10000),
  height_cm       numeric(10,2) not null check (height_cm > 0 and height_cm <= 10000),
  weight_each_kg  numeric(10,2) not null check (weight_each_kg > 0 and weight_each_kg <= 100000),
  stackable       boolean not null default true,
  dangerous_goods boolean not null default false,
  -- volume for the whole line (per-item m3 * quantity), computed server-side
  volume_m3       numeric(12,4) not null default 0,
  created_at      timestamptz not null default now()
);

create index if not exists quote_items_quote_id_idx on public.quote_items (quote_id);

-- ---------------------------------------------------------------------------
-- customer_applications
-- ---------------------------------------------------------------------------
create table if not exists public.customer_applications (
  id                          uuid primary key default gen_random_uuid(),
  application_reference        text not null unique,
  quote_id                     uuid references public.quotes(id) on delete set null,
  idempotency_key              text unique,

  legal_business_name          text not null,
  trading_name                 text,
  abn                          text not null,
  acn                          text,

  business_address             text not null,
  suburb                       text not null,
  state                        public.au_state not null,
  postcode                     text not null,

  primary_contact_name         text not null,
  primary_contact_position     text,
  primary_contact_email        text not null,
  primary_contact_phone        text not null,

  accounts_contact_name        text,
  accounts_contact_email       text,
  accounts_contact_phone       text,

  operating_open_time          time,
  operating_close_time         time,
  saturday_hours               text,
  sunday_hours                 text,
  pickup_cutoff_time           time,
  delivery_cutoff_time         time,

  site_forklift_available      boolean not null default false,
  site_loading_dock_available  boolean not null default false,
  site_tailgate_required       boolean not null default false,
  site_special_instructions    text,

  payment_method_requested     text,
  payment_terms_requested      text,
  payment_terms_approved       text,

  authorised_signatory_name     text not null,
  authorised_signatory_position text not null,
  authorised_signatory_email    text not null,
  authorised_signatory_phone    text not null,
  typed_signature               text not null,
  signature_date                date not null,

  terms_version                text not null,
  terms_accepted_at            timestamptz not null default now(),

  status                       public.application_status not null default 'pending_review',
  internal_notes               text,
  created_at                   timestamptz not null default now(),
  updated_at                   timestamptz not null default now()
);

create index if not exists customer_applications_status_idx on public.customer_applications (status);
create index if not exists customer_applications_created_at_idx on public.customer_applications (created_at desc);

drop trigger if exists customer_applications_set_updated_at on public.customer_applications;
create trigger customer_applications_set_updated_at before update on public.customer_applications
  for each row execute function public.set_updated_at();

create sequence if not exists public.onestce_application_sequence as bigint start with 1;
create or replace function public.next_application_reference()
  returns text language sql volatile as $$
  select '1STCE-APP-' || lpad(nextval('public.onestce_application_sequence')::text, 5, '0');
$$;

-- ---------------------------------------------------------------------------
-- quote_events (audit trail)
-- ---------------------------------------------------------------------------
create table if not exists public.quote_events (
  id          uuid primary key default gen_random_uuid(),
  quote_id    uuid not null references public.quotes(id) on delete cascade,
  event_type  text not null,
  event_data  jsonb not null default '{}'::jsonb,
  actor       text,
  created_at  timestamptz not null default now()
);

create index if not exists quote_events_quote_id_idx on public.quote_events (quote_id, created_at);

-- ---------------------------------------------------------------------------
-- Admin allowlist check.  ADMIN_EMAILS is stored as a GUC set per-connection by
-- the admin API (service role), OR compared against a small allowlist table.
-- ---------------------------------------------------------------------------
create table if not exists public.admin_emails (
  email       text primary key,
  created_at  timestamptz not null default now()
);

create or replace function public.is_admin()
  returns boolean language sql stable as $$
  select exists (
    select 1 from public.admin_emails
    where lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  );
$$;

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------
alter table public.quotes                enable row level security;
alter table public.quote_items           enable row level security;
alter table public.customer_applications enable row level security;
alter table public.quote_events          enable row level security;
alter table public.admin_emails          enable row level security;

-- No policies for anon/authenticated on write paths: the service role (used by
-- server APIs) bypasses RLS. Admin console reads use authenticated + is_admin().

drop policy if exists quotes_admin_read on public.quotes;
create policy quotes_admin_read on public.quotes
  for select to authenticated using (public.is_admin());

drop policy if exists quotes_admin_update on public.quotes;
create policy quotes_admin_update on public.quotes
  for update to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists quote_items_admin_read on public.quote_items;
create policy quote_items_admin_read on public.quote_items
  for select to authenticated using (public.is_admin());

drop policy if exists applications_admin_read on public.customer_applications;
create policy applications_admin_read on public.customer_applications
  for select to authenticated using (public.is_admin());

drop policy if exists applications_admin_update on public.customer_applications;
create policy applications_admin_update on public.customer_applications
  for update to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists quote_events_admin_read on public.quote_events;
create policy quote_events_admin_read on public.quote_events
  for select to authenticated using (public.is_admin());

drop policy if exists admin_emails_self_read on public.admin_emails;
create policy admin_emails_self_read on public.admin_emails
  for select to authenticated using (public.is_admin());
