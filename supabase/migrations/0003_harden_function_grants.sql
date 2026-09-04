-- Security hardening flagged by the Supabase database linter.
--
--  * 0011 function_search_path_mutable — pin search_path on every function.
--  * 0028 / 0029 — the customer write-path functions were still executable by
--    anon / authenticated through PostgREST (`/rest/v1/rpc/...`) because the
--    implicit PUBLIC EXECUTE grant survives `revoke ... from anon, authenticated`.
--    Revoke from PUBLIC so only the service role (the serverless API) can call
--    them. This is what keeps customer submissions on the validated server path.

alter function public.next_onestce_reference() set search_path = public;
alter function public.next_application_reference() set search_path = public;
alter function public.set_updated_at() set search_path = public;
alter function public.is_admin() set search_path = public;

revoke execute on function public.create_quote(jsonb, jsonb) from public, anon, authenticated;
revoke execute on function public.respond_to_quote(text, text, text) from public, anon, authenticated;
revoke execute on function public.quote_detail_json(uuid) from public, anon, authenticated;
revoke execute on function public.next_onestce_reference() from public, anon, authenticated;
revoke execute on function public.next_application_reference() from public, anon, authenticated;

-- is_admin() backs the RLS policies and must stay callable by signed-in users.
grant execute on function public.is_admin() to authenticated;
