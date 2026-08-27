import { createStart, createMiddleware } from "@tanstack/react-start";

import { renderErrorPage } from "./lib/error-page";
import { attachSupabaseAuth } from "@/integrations/supabase/auth-attacher";

// Every cookie the server sets leaves with HttpOnly, Secure and SameSite=Lax,
// so session-style cookies can never be read by JavaScript (XSS-proof) and are
// not sent on cross-site requests (CSRF-resistant).
function hardenCookies(response: Response): Response {
  const values = response.headers.getSetCookie?.() ?? [];
  if (values.length === 0) return response;
  const headers = new Headers(response.headers);
  headers.delete("set-cookie");
  for (const cookie of values) {
    let hardened = cookie;
    if (!/;\s*httponly/i.test(hardened)) hardened += "; HttpOnly";
    if (!/;\s*secure/i.test(hardened)) hardened += "; Secure";
    if (!/;\s*samesite=/i.test(hardened)) hardened += "; SameSite=Lax";
    headers.append("set-cookie", hardened);
  }
  return new Response(response.body, { status: response.status, statusText: response.statusText, headers });
}

const securityMiddleware = createMiddleware().server(async ({ next }) => {
  try {
    const result = await next();
    const response = (result as { response?: unknown }).response;
    if (response instanceof Response) {
      return { ...(result as object), response: hardenCookies(response) } as typeof result;
    }
    return result;
  } catch (error) {
    if (error instanceof Response) throw hardenCookies(error);
    if (error != null && typeof error === "object" && "statusCode" in error) {
      throw error;
    }
    console.error(error);
    return new Response(renderErrorPage(), {
      status: 500,
      headers: { "content-type": "text/html; charset=utf-8" },
    });
  }
});

export const startInstance = createStart(() => ({
  functionMiddleware: [attachSupabaseAuth],
  requestMiddleware: [securityMiddleware],
}));

