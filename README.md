# שוק בחצר · Home Market

SaaS platform for courtyard produce markets in Israel — vegetables & fruits in residential building yards.

**Stack:** Next.js · Firebase (Auth + Firestore) · Vercel

## Features (MVP)

- Bilingual landing (Hebrew / Russian)
- **Building Plan** — vaad defines max stalls, categories & rules
- Waitlist → Firestore
- Types for `BuildingPlan`, `MarketEvent`, vendor slots

## Local dev

```bash
npm install
cp .env.example .env.local
# Add Firebase web app config from Firebase Console
npm run dev
```

## Firebase

Project: **home-market-il** · [Console](https://console.firebase.google.com/project/home-market-il/overview)

1. Copy `.env.example` → `.env.local` (or pull from Vercel: `vercel env pull`)
2. Firestore database: `(default)` in **eur3** (Europe)
3. Deploy rules: `npm run firebase:deploy-rules`

Collections: `waitlist`, `buildingPlans`, `marketEvents`, …

## Deploy

Connected to [Vercel](https://vercel.com) via GitHub `josefwebdeveloper/home-market`.
