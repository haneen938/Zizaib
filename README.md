# Zizaib

Handmade crochet storefront — TanStack Start (React 19 + Vite) with Supabase for
orders, reviews and receipt storage.

## Requirements

- Node.js 20 or newer
- npm 10 or newer

## Folder structure

```
zizaib/
├── src/
│   ├── routes/        file-based routes (__root.tsx is the app shell)
│   ├── components/    UI components
│   ├── lib/           server functions, validation, helpers
│   ├── data/          product + category catalog
│   ├── store/         zustand stores (cart, currency)
│   └── integrations/  Supabase clients
├── public/photos/     all site imagery
├── supabase/          database migrations + config
├── package.json
├── vite.config.ts
├── tsconfig.json
└── .env
```

Everything lives in this one folder — there is no nested project directory.

## Environment variables

Create a `.env` file in the project root:

```env
SUPABASE_URL="https://<project-ref>.supabase.co"
SUPABASE_PUBLISHABLE_KEY="<publishable / anon key>"
SUPABASE_PROJECT_ID="<project-ref>"
SUPABASE_SERVICE_ROLE_KEY="<service role key — server only>"

VITE_SUPABASE_URL="https://<project-ref>.supabase.co"
VITE_SUPABASE_PUBLISHABLE_KEY="<publishable / anon key>"
VITE_SUPABASE_PROJECT_ID="<project-ref>"
```

`SUPABASE_SERVICE_ROLE_KEY` must never be given a `VITE_` prefix — that would
ship it to the browser. On boot the server prints a clear list of anything
missing (see `src/lib/env-check.server.ts`).

## Run it locally

```sh
npm install
npm run dev
```

Then open http://localhost:8080

## Other commands

| Command | What it does |
| --- | --- |
| `npm run dev` (or `npm start`) | dev server on port 8080 |
| `npm run build` | production build into `dist/` |
| `npm run preview` | serve the production build |
| `npm test` | unit tests (Vitest) |
| `npm run lint` | ESLint |
| `npm run format` | Prettier |

## Database

SQL migrations live in `supabase/migrations/`. Apply them to your Supabase
project with the Supabase CLI:

```sh
supabase link --project-ref <project-ref>
supabase db push
```

The storefront reads from the `orders` and `reviews` tables and uploads bank
transfer receipts to the private `receipts` storage bucket.
