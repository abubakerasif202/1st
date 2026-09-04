-- Customer application write path. SECURITY DEFINER, service role only.
-- Credit terms are REQUESTED here — status stays 'pending_review' and
-- payment_terms_approved is left null. Nothing in this function approves credit.

create or replace function public.application_detail_json(p_id uuid)
  returns jsonb
  language sql
  stable
  security definer
  set search_path = public
as $$
  select to_jsonb(a) from public.customer_applications a where a.id = p_id;
$$;

create or replace function public.create_customer_application(p_app jsonb)
  returns jsonb
  language plpgsql
  security definer
  set search_path = public
as $$
declare
  v_key text := nullif(p_app->>'idempotency_key', '');
  v_id  uuid;
begin
  if v_key is not null then
    select id into v_id from public.customer_applications where idempotency_key = v_key;
    if v_id is not null then
      return public.application_detail_json(v_id);
    end if;
  end if;

  insert into public.customer_applications (
    application_reference, idempotency_key, quote_id,
    legal_business_name, trading_name, abn, acn,
    business_address, suburb, state, postcode,
    primary_contact_name, primary_contact_position, primary_contact_email, primary_contact_phone,
    accounts_contact_name, accounts_contact_email, accounts_contact_phone,
    operating_open_time, operating_close_time, saturday_hours, sunday_hours,
    pickup_cutoff_time, delivery_cutoff_time,
    site_forklift_available, site_loading_dock_available, site_tailgate_required, site_special_instructions,
    payment_method_requested, payment_terms_requested,
    authorised_signatory_name, authorised_signatory_position, authorised_signatory_email, authorised_signatory_phone,
    typed_signature, signature_date,
    terms_version, terms_accepted_at, status
  )
  values (
    public.next_application_reference(), v_key, nullif(p_app->>'quote_id', '')::uuid,
    p_app->>'legal_business_name', nullif(p_app->>'trading_name', ''), p_app->>'abn', nullif(p_app->>'acn', ''),
    p_app->>'business_address', p_app->>'suburb', (p_app->>'state')::public.au_state, p_app->>'postcode',
    p_app->>'primary_contact_name', nullif(p_app->>'primary_contact_position', ''), p_app->>'primary_contact_email', p_app->>'primary_contact_phone',
    nullif(p_app->>'accounts_contact_name', ''), nullif(p_app->>'accounts_contact_email', ''), nullif(p_app->>'accounts_contact_phone', ''),
    nullif(p_app->>'operating_open_time', '')::time, nullif(p_app->>'operating_close_time', '')::time,
    nullif(p_app->>'saturday_hours', ''), nullif(p_app->>'sunday_hours', ''),
    nullif(p_app->>'pickup_cutoff_time', '')::time, nullif(p_app->>'delivery_cutoff_time', '')::time,
    coalesce((p_app->>'site_forklift_available')::boolean, false), coalesce((p_app->>'site_loading_dock_available')::boolean, false),
    coalesce((p_app->>'site_tailgate_required')::boolean, false), nullif(p_app->>'site_special_instructions', ''),
    nullif(p_app->>'payment_method_requested', ''), nullif(p_app->>'payment_terms_requested', ''),
    p_app->>'authorised_signatory_name', p_app->>'authorised_signatory_position', p_app->>'authorised_signatory_email', p_app->>'authorised_signatory_phone',
    p_app->>'typed_signature', (p_app->>'signature_date')::date,
    p_app->>'terms_version', now(), 'pending_review'
  )
  returning id into v_id;

  return public.application_detail_json(v_id);
end $$;

revoke execute on function public.create_customer_application(jsonb) from public, anon, authenticated;
revoke execute on function public.application_detail_json(uuid) from public, anon, authenticated;
