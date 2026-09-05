# Deploying Zizaib

## Lovable (default)

Publish from the Lovable editor. No configuration required — the build targets a
Cloudflare Worker and Lovable injects the Supabase environment variables.

## Vercel

The Nitro preset is now read from `NITRO_PRESET` (default `cloudflare-module`),
so Vercel builds only need the preset variable plus the Supabase keys.

Project settings:

| Setting          | Value           |
| ---------------- | --------------- |
| Framework preset | Other           |
| Install command  | `bun install`   |
| Build command    | `bun run build` |
| Output directory | `dist`          |
| Node version     | 20 or later     |

Environment variables (Production **and** Preview):

| Name                             | Scope   | Purpose                                       |
| -------------------------------- | ------- | --------------------------------------------- |
| `NITRO_PRESET`                   | build   | Set to `vercel`                                |
| `SUPABASE_URL`                   | server  | Backend project URL                            |
| `SUPABASE_PUBLISHABLE_KEY`       | server  | Public key used by server functions            |
| `SUPABASE_SERVICE_ROLE_KEY`      | server  | Privileged writes (receipt uploads) — secret   |
| `SUPABASE_PROJECT_ID`            | server  | Project reference                              |
| `VITE_SUPABASE_URL`              | browser | Same URL, exposed to the client                |
| `VITE_SUPABASE_PUBLISHABLE_KEY`  | browser | Same public key, exposed to the client         |
| `VITE_SUPABASE_PROJECT_ID`       | browser | Project reference for the client               |

Never set a service-role key as a `VITE_` variable — anything prefixed `VITE_`
is bundled into the browser.

## Security notes

- All state-changing server-function requests are origin-checked (CSRF) in
  `src/start.ts`; cookies are forced to `HttpOnly; Secure; SameSite=Lax`.
- HTTPS is terminated by the host (Lovable or Vercel); no plain-HTTP origin is served.
