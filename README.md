# google-checkinsai

Dedicated Google Hotel Center Integration Microservice for **CheckinsAI** (`checkins.ai`).

---

## Technical Stack
- **Framework**: Hono.js / TypeScript
- **Deployment Platform**: Cloudflare Workers (Edge Network)
- **Protocols**: Google Hotel Prices XML (Listings XML, PointsOfSale XML, Transaction Live Query XML)
- **Pricing Strategy**: Option B (Public Standard Rate for Google Bots + Member Rate on `checkins.ai`)

---

## Endpoints

| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/health` | `GET` | Microservice Health & Uptime Status |
| `/feeds/google-hotel-list.xml` | `GET` | Google Hotel List Feed XML (`<listings>`) |
| `/feeds/google-landing-pages.xml` | `GET` | Google Landing Pages POS XML (`<PointsOfSale>`) |
| `/api/google/live-query` | `POST` | Real-time Google Live Pricing Query Endpoint (`<Transaction>`) |

---

## Setup & Local Testing

1. Install dependencies:
   ```bash
   npm install
   ```
2. Run tests:
   ```bash
   npm test
   ```
3. Run local dev server:
   ```bash
   npm run dev
   ```

---

## Cloudflare Deployment

Deploy to Cloudflare Workers:
```bash
npm run deploy
```
