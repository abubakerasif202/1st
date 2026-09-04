-- Initial admin allowlist entry. `admin_emails` backs the is_admin() RLS policy;
-- the serverless admin API additionally checks the ADMIN_EMAILS env var. Add or
-- remove admins by editing this table (and the env var).

insert into public.admin_emails (email)
values ('abubakarasif2002@gmail.com')
on conflict (email) do nothing;
