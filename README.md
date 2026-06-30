# Luxury Pickleball Jewelry — E-Commerce

Direct-to-consumer site for handcrafted pickleball-inspired fine jewelry. Editorial presentation, made-to-order configurator, Stripe checkout, white-glove concierge flow.

> **The full operational specification — architecture, data model, customer journey, fulfillment, marketing, compliance, security, vendor requests, costs, and 90-day launch plan — lives in [`Flagship_Build_Specification.pdf`](./Flagship_Build_Specification.pdf). Treat it as the source of truth; this README is the developer quick-start.**

## ⚠️ Next.js 16

This project runs on Next.js 16 — APIs, conventions, and file structure differ from earlier versions and from most LLM training data. Before writing code, read the relevant guide in `node_modules/next/dist/docs/` and heed deprecation notices. See [`AGENTS.md`](./AGENTS.md).

## Quick start

```bash
npm install              # postinstall runs `prisma generate`
cp .env.example .env     # fill in the secrets (see below)
npm run dev              # http://localhost:3000
```

Other scripts:

| Command | Purpose |
|---|---|
| `npm run build` | Prisma generate + Next build |
| `npm run start` | Run the production build |
| `npm run lint` / `lint:fix` | ESLint |
| `npm run typecheck` | `tsc --noEmit` |

## Required env vars

Minimum to boot locally. Full list with rotation cadence in Appendix C of the Flagship PDF.

```
DATABASE_URL=file:./dev.db
JWT_ACCESS_SECRET=<openssl rand -hex 64>
FIELD_ENCRYPTION_KEY=<openssl rand -hex 32>
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_SITE_URL=http://localhost:3000
RESEND_API_KEY=re_...
FROM_EMAIL=concierge@yourdomain.com
NODE_ENV=development
```

## Tech stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16 App Router · React 19 · TypeScript (strict) |
| Styling | Tailwind 4 + CSS custom properties |
| Motion | GSAP · Framer Motion · Lenis |
| 3D | Three.js + React Three Fiber + Drei (lazy-loaded) |
| Data | Prisma 7 with libSQL adapter (Turso in prod) |
| Auth | Custom JWT — Argon2id passwords, refresh-token family rotation, AES-256-GCM field encryption |
| Payments | Stripe Checkout + webhooks |
| Email | Resend (transactional); Klaviyo (marketing) |
| Validation | Zod 4 |
| Deploy | Vercel |

## Project layout

```
src/
  app/                    App Router routes + API handlers
    api/                  Route handlers (auth, checkout, webhook, admin, …)
    customize/            Configurator + per-piece bespoke pages
    collections/ story/ concierge/ cart/ profile/ login/ register/ product/
    layout.tsx globals.css robots.ts sitemap.ts
  components/             UI primitives, sections, layout, three/, customize/
  hooks/                  Reusable client hooks
  lib/                    Shared logic
    server/               Server-only: auth, db, stripe, email, audit, middleware
    catalog.ts pricing.ts bespoke/  Catalog, price engine, bespoke variant data
  generated/prisma/       Prisma client (committed for Vercel deploy)
  middleware.ts           Edge middleware (CSRF, WAF, rate limit hooks)
prisma/schema.prisma      Database schema
public/                   Images, videos, model assets
```

## Deploy

Production target is Vercel. Push to `main` triggers a deploy; ensure env vars from Appendix C are set in the Vercel dashboard. Database is Turso (libSQL) in production. There is no Docker setup — Vercel handles the runtime.

## Source of truth

For anything beyond the dev loop — data model, order state machine, fulfillment runbook, vendor questions, cost structure, legal posture — open [`Flagship_Build_Specification.pdf`](./Flagship_Build_Specification.pdf).
