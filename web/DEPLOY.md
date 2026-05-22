# PoopFare — Production

## Prerequisites

- Node 20+
- Vercel account
- GitHub repo (for automated daily batch updates)

## Environment variables

Copy `.env.example` → `.env.local` for local dev:

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_SITE_URL` | Yes (prod) | Canonical URL, e.g. `https://poopfare.vercel.app` |
| `UPSTASH_REDIS_REST_URL` | Yes (prod) | Free Redis from [Upstash](https://console.upstash.com) — shared live vote totals |
| `UPSTASH_REDIS_REST_TOKEN` | Yes (prod) | Upstash REST token |

Without Upstash, votes work locally only (`data/live-votes.json`) and **reset on Vercel** — set Upstash before going live.

In Vercel: **Project → Settings → Environment Variables** — set `NEXT_PUBLIC_SITE_URL` for Production.

## Build & verify locally

```bash
cd web
npm install
npm run build
```

`prebuild` runs `check:prod` — verifies seed roster, daily batch, and config files.

## Daily poopanthropists (India-heavy)

Fetches **12 daily picks** (minimum **6 from India**) from Google News RSS + GDELT, enriched via Wikipedia (~5–8 min).

```bash
cd web
npm run fetch:daily-villains   # writes src/data/daily-villains.json
```

**Production:** the bundled JSON ships with each deploy. The API route serves it instantly (no serverless fetch — too slow for Vercel).

**Automation:** `.github/workflows/daily-villains.yml` runs daily at **00:30 UTC (~6:00 AM IST)**, commits `daily-villains.json`, and optionally hits a Vercel deploy hook.

GitHub secret (optional): `VERCEL_DEPLOY_HOOK` — create in Vercel → Project → Settings → Git → Deploy Hooks.

## Deploy to Vercel

```bash
cd web
npx vercel --prod
```

Or connect the Git repo with **Root Directory** = `web`.

Set `NEXT_PUBLIC_SITE_URL` to your production URL after the first deploy.

## Live votes (real totals, not fake)

Every poop tap calls `POST /api/votes` and increments shared counters. Leaderboard polls every 5 seconds.

**Setup (5 min, free):**
1. Go to [console.upstash.com](https://console.upstash.com) → Create Redis database
2. Copy **REST URL** and **REST Token**
3. Add both to Vercel env vars (and `.env.local` for local dev)

Local dev without Upstash uses `data/live-votes.json` automatically.

## Post-deploy checklist

- [ ] `/` loads, play loop works
- [ ] `/api/daily-villains` returns 12 picks with `indiaCount >= 6`
- [ ] `/leaderboard`, `/nominate`, `/legal` return 200
- [ ] GitHub Action `Daily poopanthropists` runs (Actions tab)
