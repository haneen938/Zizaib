import { createMiddleware } from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";

/**
 * Replaces the generated `attachSupabaseAuth`. Same behaviour (attach the bearer
 * token to server-function RPCs) but the session lookup can never block the call:
 * on a slow or unavailable auth storage broker we fall through unauthenticated
 * instead of leaving the request pending forever.
 */
const SESSION_TIMEOUT_MS = 1500;

export const attachSupabaseAuthSafely = createMiddleware({ type: "function" }).client(
  async ({ next }) => {
    let token: string | undefined;
    try {
      const session = await Promise.race([
        supabase.auth.getSession().then(({ data }) => data.session),
        new Promise<null>((resolve) => setTimeout(() => resolve(null), SESSION_TIMEOUT_MS)),
      ]);
      token = session?.access_token;
    } catch {
      token = undefined;
    }
    return next({ headers: token ? { Authorization: `Bearer ${token}` } : {} });
  },
);
