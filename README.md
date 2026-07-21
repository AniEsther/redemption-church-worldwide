# Redemption Church Backend

Express + MongoDB API that powers the contact form, prayer requests, newsletter
signups, testimonies, sermons, and events for the frontend.

## Setup

1. Install MongoDB, or create a free cluster at [mongodb.com/atlas](https://www.mongodb.com/atlas).
2. Copy the env file and fill in your values:
   ```bash
   cp .env.example .env
   ```
3. Install dependencies and start the dev server:
   ```bash
   npm install
   npm run dev
   ```
   The API runs at `http://localhost:5000` by default.
4. Create your first admin login (used to manage messages, sermons, events):
   ```bash
   npm run seed:admin
   ```
   This uses the `ADMIN_EMAIL` / `ADMIN_PASSWORD` in your `.env`.

## API Reference

### Public endpoints
| Method | Route | Body |
|---|---|---|
| POST | `/api/contact` | `{ name, email, phone?, message }` |
| POST | `/api/prayer-requests` | `{ name, email, category?, request, confidential? }` |
| POST | `/api/newsletter` | `{ email }` |
| GET | `/api/testimonies` | — returns approved testimonies |
| POST | `/api/testimonies` | `{ name, email?, text }` — submitted for review |
| GET | `/api/sermons` | — |
| GET | `/api/events` | — |

### Admin endpoints (require `Authorization: Bearer <token>`)
| Method | Route | Purpose |
|---|---|---|
| POST | `/api/auth/login` | `{ email, password }` → returns `{ token }` |
| GET | `/api/contact` | List all messages |
| PATCH | `/api/contact/:id/read` | Mark message read |
| GET | `/api/prayer-requests` | List all requests |
| PATCH | `/api/prayer-requests/:id/prayed` | Mark as prayed for |
| GET | `/api/newsletter` | List subscribers |
| GET | `/api/testimonies/all` | List all testimonies (incl. unapproved) |
| PATCH | `/api/testimonies/:id/approve` | Approve a testimony |
| DELETE | `/api/testimonies/:id` | Delete a testimony |
| POST / PUT / DELETE | `/api/sermons`, `/api/sermons/:id` | Manage sermons |
| POST / PUT / DELETE | `/api/events`, `/api/events/:id` | Manage events |

Public form endpoints are rate-limited (10 requests / 15 min per IP) to
prevent spam.

## Connecting the frontend

In `frontend/.env`, set:
```
VITE_API_URL=http://localhost:5000/api
```

## Deploying

- **API:** Render, Railway, or Fly.io all work well for a small Express app.
- **Database:** MongoDB Atlas free tier is enough to start.
- Remember to set `CLIENT_ORIGIN` in production to your real frontend domain,
  and use a strong, random `JWT_SECRET`.

## What's not built yet

- There's no admin dashboard UI — admin actions currently need to be called
  directly (e.g. with Postman/Insomnia) or you can ask me to build a simple
  admin page in the frontend that talks to these routes.
- Online giving is still just displayed bank details — real payments need a
  processor like Paystack or Flutterwave wired in separately.
