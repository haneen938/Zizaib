REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM anon, public;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated, service_role;

REVOKE EXECUTE ON FUNCTION public.track_order(text) FROM public;
GRANT EXECUTE ON FUNCTION public.track_order(text) TO anon, authenticated, service_role;