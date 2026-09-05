import { createStart, createMiddleware } from "@tanstack/react-start";

import { renderErrorPage } from "./lib/error-page";
import { attachSupabaseAuthSafely } from "@/lib/supabase-auth-attacher";

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

// CSRF: state-changing requests must come from our own origin. Browsers always
// send Origin (or at least Referer) on cross-site POSTs, so a mismatch means the
// request was forged by another site and is rejected before any handler runs.
const SAFE_METHODS = new Set(["GET", "HEAD", "OPTIONS"]);

function isCrossSite(request: Request): boolean {
  if (SAFE_METHODS.has(request.method.toUpperCase())) return false;
  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
  if (!host) return false;
  const source = request.headers.get("origin") ?? request.headers.get("referer");
  if (!source) return true; // no provenance on a write → treat as forged
  try {
    return new URL(source).host !== host;
  } catch {
    return true;
  }
}

const securityMiddleware = createMiddleware().server(async ({ next, request }) => {
  if (request instanceof Request && isCrossSite(request)) {
    return new Response("Cross-site request blocked", {
      status: 403,
      headers: { "content-type": "text/plain; charset=utf-8" },
    });
  }
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
  functionMiddleware: [attachSupabaseAuthSafely],
  requestMiddleware: [securityMiddleware],
}));

