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

1. Create a Firebase project
2. Enable Firestore
3. Add a web app → copy config to `.env.local`
4. Deploy rules: `firebase deploy --only firestore:rules`

## Deploy

Connected to [Vercel](https://vercel.com) via GitHub `josefwebdeveloper/home-market`.
