// Boot-time guard: fail loudly (and readably) when the Supabase configuration
// is incomplete, instead of dying with an opaque "Invalid URL" later on.

const REQUIRED = [
  { key: "SUPABASE_URL", hint: "Project REST URL, e.g. https://xxxx.supabase.co" },
  { key: "SUPABASE_PUBLISHABLE_KEY", hint: "Publishable / anon key (safe for the browser)" },
  { key: "SUPABASE_PROJECT_ID", hint: "Project reference id" },
  { key: "SUPABASE_SERVICE_ROLE_KEY", hint: "Service role key — server only, never in VITE_ vars" },
] as const;

let reported = false;

export function checkSupabaseEnv(): void {
  if (reported) return;
  reported = true;

  const missing = REQUIRED.filter(({ key }) => !process.env[key]?.trim());
  if (missing.length === 0) return;

  const lines = missing.map(({ key, hint }) => `  - ${key}  (${hint})`).join("\n");
  const message =
    `\n\u2717 Missing required environment variables:\n${lines}\n\n` +
    `Add them to the .env file in the project root, then restart the dev server.\n`;

  // Loud in the terminal, but the app keeps booting so the rest of the site
  // (catalog, pages) still renders while you fix the .env file.
  console.error(message);
}
