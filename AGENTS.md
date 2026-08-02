# GearUp Frontend (gearup-clint)

## Project Overview

GearUp is a sports and outdoor gear rental platform. Users can browse gear,
book rentals by the day, pay via Stripe, and leave reviews. Providers list gear
and manage incoming rental requests. This repo is the **Next.js (App Router)
client**; the API lives in `../GearUp-backend` (Express + Prisma + PostgreSQL).

## Tech Stack

- Next.js 16 (App Router) + TypeScript
- Tailwind CSS v4
- axios (HTTP client)
- Backend base URL: `http://localhost:5000/api` (see `.env.local`, key
  `NEXT_PUBLIC_API_URL`)

## Commands

- `npm run dev` - start dev server
- `npm run build` - production build (also type-checks)
- `npm run start` - serve production build
- `npm run lint` - run ESLint (`.next/**`, `out/**`, `build/**`,
  `next-env.d.ts` are ignored)

## Environment Variables

| Variable                | Description             | Example                     |
| ----------------------- | ----------------------- | --------------------------- |
| `NEXT_PUBLIC_API_URL`   | Backend API base URL    | `http://localhost:5000/api` |

- `.env*` files are gitignored. Copy values from the backend's `.env.example`
  for local development.
- Only `NEXT_PUBLIC_*` variables are inlined into client code. `process.env`
  is read at build time.

## Folder Structure (`src/`)

```
src/
├── app/                     # App Router routes (layout.tsx, page.tsx, globals.css)
│   ├── (auth)/              # login, register, forgot-password
│   ├── (marketing)/         # public pages (home, browse gear, gear detail)
│   └── (dashboard)/         # authenticated areas (customer/provider/admin)
├── components/
│   ├── ui/                  # reusable primitives (Button, Input, Modal, ...)
│   └── shared/              # app-level blocks (Navbar, Footer, GearCard, ...)
├── hooks/                   # custom React hooks (useAuth, useDebounce, ...)
├── lib/
│   ├── axios.ts             # global axios instance + auth interceptors
│   └── constants.ts         # app-wide constants (e.g. rental status labels)
├── services/                # typed API modules (auth.service.ts, gear.service.ts, ...)
├── store/                   # global client state (Zustand stores)
├── types/
│   └── index.ts             # shared TS interfaces (User, Gear, Rental, APIResponse, ...)
└── utils/                   # pure helpers (formatting, date math, validators, ...)
```

## API Conventions

- **Base URL:** `process.env.NEXT_PUBLIC_API_URL`. All requests go through the
  shared instance in `src/lib/axios.ts`.
- **Response shape:** every endpoint returns
  `{ success, message, data, meta? }`. `meta: { page, limit, total }` is only
  present on paginated list endpoints. Error responses omit `data` and include
  `error` and `stack` (dev only).
- **Auth (HTTP-only cookies):** login/register set `accessToken` and
  `refreshToken` cookies. `withCredentials: true` is enabled on the shared
  axios instance so cookies are sent automatically.
- **Refresh flow:** on a `401`, the response interceptor calls
  `POST /auth/refresh-token` once, then retries the original request.
  Concurrent 401s are queued behind a single refresh. If refresh fails, the
  user is redirected to `/login`.
- **Bearer fallback:** the `accessToken` returned in login/register response
  bodies can be set via `setAccessToken(token)` from `src/lib/axios.ts`; the
  request interceptor attaches it as `Authorization: Bearer ...`.
- **Auth endpoints** (`/auth/*`) are excluded from the auto-refresh logic.
- **File uploads:** gear images use field name `images` (max 5), profile photo
  uses `profilePhoto`, single upload uses `image`; send as `multipart/form-data`.
- **Webhooks:** `/payments/success` and `/payments/fail` are Stripe webhooks
  (raw body). Never call them from the client with JSON.

## Enums

- `Role`: `CUSTOMER | PROVIDER | ADMIN`
- `RentalStatus`: `PLACED | CONFIRMED | PAID | CANCELLED | PICKED_UP | RETURNED`

## Conventions

- Path alias `@/*` maps to `./src/*` (see `tsconfig.json`).
- Use `@/types` for shared interfaces; model frontend types after the Prisma
  schema in `../GearUp-backend/prisma/schema/` and the contract in
  `../GearUp-backend/api_doc.md`.
- Server components fetch data server-side where possible; client mutations
  call the typed service functions in `src/services/`.
- No code comments unless asked.

<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->
