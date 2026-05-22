# PoopFare

Satirical daily poop allocation game — pick who deserves it most.

## Local dev

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Dev server |
| `npm run build` | Production build (+ prod check) |
| `npm run fetch:daily-villains` | Fetch 12 daily picks (6+ India) from news |
| `npm run generate:persons` | Regenerate seed roster from `scripts/person-seed.json` |
| `npm run check:prod` | Verify data files & config |

## Production

**Build status:** `npm run build` passes with 200 seed persons + 12 daily picks (6 India).

```bash
npm run build          # includes prebuild prod check
npm run check:prod     # verify data files only
```

Deploy steps: **[DEPLOY.md](./DEPLOY.md)**

Quick Vercel deploy (after `npx vercel login`):

```bash
npx vercel --prod
```

Set `NEXT_PUBLIC_SITE_URL` in Vercel env vars to your live URL.

Daily batch auto-refresh: GitHub Action at `.github/workflows/daily-villains.yml` (push repo to GitHub, optional `VERCEL_DEPLOY_HOOK` secret).
