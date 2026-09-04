-- Transaction-safe write paths for the freight quote system.
--
-- Everything a customer submission touches happens inside one function call so
-- the 1STCE reference, the quote row, its items and the audit event are created
-- atomically — a failure anywhere rolls the whole thing back and no reference is
-- consumed for a half-written quote.
--
-- These functions are SECURITY DEFINER and are NOT granted to anon/authenticated:
-- only the service role (the serverless API) invokes them.

-- ---------------------------------------------------------------------------
-- quote_detail_json(uuid) -> { quote, items, token }
-- ---------------------------------------------------------------------------
create or replace function public.quote_detail_json(p_id uuid)
  returns jsonb
  language sql
  stable
  security definer
  set search_path = public
as $$
  select jsonb_build_object(
    'quote', to_jsonb(q),
    'items', coalesce(
      (select jsonb_agg(to_jsonb(i) order by i.created_at, i.id)
         from public.quote_items i where i.quote_id = q.id),
      '[]'::jsonb
    ),
    'token', q.respond_token
  )
  from public.quotes q
  where q.id = p_id;
$$;

-- ---------------------------------------------------------------------------
-- create_quote(p_quote jsonb, p_items jsonb) -> { quote, items, token }
--
-- p_quote keys are the snake_case column names. Totals are supplied by the API
-- (recomputed server-side from p_items) and stored verbatim.
-- Re-submitting the same idempotency_key returns the original quote unchanged.
-- ---------------------------------------------------------------------------
create or replace function public.create_quote(p_quote jsonb, p_items jsonb)
  returns jsonb
  language plpgsql
  security definer
  set search_path = public
as $$
declare
  v_key   text := nullif(p_quote->>'idempotency_key', '');
  v_id    uuid;
  v_item  jsonb;
begin
  if v_key is not null then
    select id into v_id from public.quotes where idempotency_key = v_key;
    if v_id is not null then
      return public.quote_detail_json(v_id);
    end if;
  end if;

  insert into public.quotes (
    reference_number, idempotency_key,
    customer_company, customer_name, customer_email, customer_phone,
    preferred_contact_method, customer_reference, customer_notes,
    pickup_address_line_1, pickup_address_line_2, pickup_suburb, pickup_state, pickup_postcode,
    pickup_contact_name, pickup_contact_phone, pickup_date, pickup_ready_time, pickup_cutoff_time, pickup_notes,
    delivery_address_line_1, delivery_address_line_2, delivery_suburb, delivery_state, delivery_postcode,
    delivery_contact_name, delivery_contact_phone, requested_delivery_date, delivery_cutoff_time, delivery_notes,
    pickup_tailgate_required, pickup_forklift_available, pickup_loading_dock_available, pickup_customer_loads,
    delivery_tailgate_required, delivery_forklift_available, delivery_loading_dock_available, delivery_receiver_unloads,
    service_priority, service_specific_date, delivery_authority, atl_instructions,
    total_items, total_weight_kg, total_volume_m3,
    terms_accepted, terms_version, terms_accepted_at
  )
  values (
    public.next_onestce_reference(), v_key,
    nullif(p_quote->>'customer_company', ''), p_quote->>'customer_name', p_quote->>'customer_email', p_quote->>'customer_phone',
    nullif(p_quote->>'preferred_contact_method', ''), nullif(p_quote->>'customer_reference', ''), nullif(p_quote->>'customer_notes', ''),
    p_quote->>'pickup_address_line_1', nullif(p_quote->>'pickup_address_line_2', ''), p_quote->>'pickup_suburb',
      (p_quote->>'pickup_state')::public.au_state, p_quote->>'pickup_postcode',
    p_quote->>'pickup_contact_name', p_quote->>'pickup_contact_phone', (p_quote->>'pickup_date')::date,
      nullif(p_quote->>'pickup_ready_time', '')::time, (p_quote->>'pickup_cutoff_time')::time, nullif(p_quote->>'pickup_notes', ''),
    p_quote->>'delivery_address_line_1', nullif(p_quote->>'delivery_address_line_2', ''), p_quote->>'delivery_suburb',
      (p_quote->>'delivery_state')::public.au_state, p_quote->>'delivery_postcode',
    p_quote->>'delivery_contact_name', p_quote->>'delivery_contact_phone', nullif(p_quote->>'requested_delivery_date', '')::date,
      (p_quote->>'delivery_cutoff_time')::time, nullif(p_quote->>'delivery_notes', ''),
    coalesce((p_quote->>'pickup_tailgate_required')::boolean, false), coalesce((p_quote->>'pickup_forklift_available')::boolean, false),
      coalesce((p_quote->>'pickup_loading_dock_available')::boolean, false), coalesce((p_quote->>'pickup_customer_loads')::boolean, false),
    coalesce((p_quote->>'delivery_tailgate_required')::boolean, false), coalesce((p_quote->>'delivery_forklift_available')::boolean, false),
      coalesce((p_quote->>'delivery_loading_dock_available')::boolean, false), coalesce((p_quote->>'delivery_receiver_unloads')::boolean, false),
    (p_quote->>'service_priority')::public.service_priority, nullif(p_quote->>'service_specific_date', '')::date,
      (p_quote->>'delivery_authority')::public.delivery_authority, nullif(p_quote->>'atl_instructions', ''),
    coalesce((p_quote->>'total_items')::integer, 0), coalesce((p_quote->>'total_weight_kg')::numeric, 0),
      coalesce((p_quote->>'total_volume_m3')::numeric, 0),
    true, p_quote->>'terms_version', now()
  )
  returning id into v_id;

  for v_item in select value from jsonb_array_elements(p_items)
  loop
    insert into public.quote_items (
      quote_id, item_type, description, quantity,
      length_cm, width_cm, height_cm, weight_each_kg,
      stackable, dangerous_goods, volume_m3
    )
    values (
      v_id, (v_item->>'item_type')::public.freight_item_type, nullif(v_item->>'description', ''), (v_item->>'quantity')::integer,
      (v_item->>'length_cm')::numeric, (v_item->>'width_cm')::numeric, (v_item->>'height_cm')::numeric, (v_item->>'weight_each_kg')::numeric,
      coalesce((v_item->>'stackable')::boolean, true), coalesce((v_item->>'dangerous_goods')::boolean, false),
      coalesce((v_item->>'volume_m3')::numeric, 0)
    );
  end loop;

  insert into public.quote_events (quote_id, event_type, event_data, actor)
  values (v_id, 'created', jsonb_build_object('reference', (select reference_number from public.quotes where id = v_id)), 'customer');

  return public.quote_detail_json(v_id);
end $$;

-- ---------------------------------------------------------------------------
-- respond_to_quote(p_reference, p_token, p_action)
--
-- Secure customer accept/decline. Requires the opaque respond_token — the bare
-- reference number is never enough. Only valid on a quote that has been priced.
-- ---------------------------------------------------------------------------
create or replace function public.respond_to_quote(p_reference text, p_token text, p_action text)
  returns jsonb
  language plpgsql
  security definer
  set search_path = public
as $$
declare
  v_quote public.quotes;
begin
  if p_action not in ('accept', 'decline') then
    raise exception 'invalid action' using errcode = '22023';
  end if;

  select * into v_quote from public.quotes
  where reference_number = p_reference and respond_token = p_token;

  if not found then
    raise exception 'quote not found' using errcode = 'no_data_found';
  end if;

  if v_quote.status not in ('quoted', 'accepted', 'declined') then
    raise exception 'quote is not open for a response' using errcode = '22023';
  end if;

  update public.quotes
  set status = case when p_action = 'accept' then 'accepted'::public.quote_status
                    else 'declined'::public.quote_status end,
      quote_accepted_at = case when p_action = 'accept' then now() else quote_accepted_at end
  where id = v_quote.id;

  insert into public.quote_events (quote_id, event_type, event_data, actor)
  values (v_quote.id, 'customer_response', jsonb_build_object('action', p_action), 'customer');

  return public.quote_detail_json(v_quote.id);
end $$;

-- Explicitly keep these off the public API surface.
revoke all on function public.create_quote(jsonb, jsonb) from anon, authenticated;
revoke all on function public.respond_to_quote(text, text, text) from anon, authenticated;
revoke all on function public.quote_detail_json(uuid) from anon, authenticated;
