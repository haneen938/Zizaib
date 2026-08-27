CREATE OR REPLACE FUNCTION public.generate_tracking_number()
RETURNS text
LANGUAGE sql
VOLATILE
SET search_path = public
AS $$
  SELECT 'ZB' || to_char(now(), 'YYMMDD') || upper(substr(md5(gen_random_uuid()::text), 1, 6));
$$;