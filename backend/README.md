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

## File storage (Cloudinary)

By default, uploaded photos/audio/PDFs are saved to local disk — fine for
development, but most hosting providers wipe local files on every redeploy.
For production, set these three variables in `.env` (get them from your
[Cloudinary dashboard](https://cloudinary.com/console), free tier is fine):

```
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
```

Once all three are set, uploads automatically switch to Cloudinary — no
other code changes needed. Leave them blank to keep using local disk.

## Email notifications

To get an email whenever someone submits the contact form or a prayer
request, set these in `.env`:

```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
NOTIFY_EMAIL=admin@redemptionchurchworldwide.org
```

For Gmail, use an **App Password** (not your real password) —
generate one at https://myaccount.google.com/apppasswords. Any other SMTP
provider (Zoho, Outlook, a transactional email service) works too, just
change `SMTP_HOST`/`SMTP_PORT` accordingly. Leave these blank to disable
notifications — form submissions still save to the database either way.

## Fixing duplicate bank accounts

If extra/duplicate Give accounts ever get added by hand via the admin
panel, `npm run fix:give-accounts` resets `bankAccounts` back to exactly
the four canonical ones (Tithe, Project, Mission, Alms) — then just edit
in the real account numbers at `/admin/settings`.

## Deploying

- **API:** Render, Railway, or Fly.io all work well for a small Express app.
- **Database:** MongoDB Atlas free tier is enough to start.
- Remember to set `CLIENT_ORIGIN` in production to your real frontend domain,
  use a strong, random `JWT_SECRET`, and configure Cloudinary + email
  notifications (above) before real users start submitting forms.

## What's not built yet

- Online giving is still just displayed bank details — real payments need a
  processor like Paystack or Flutterwave wired in separately.
- No password-reset flow for the admin account — if you forget it, re-run
  `npm run seed:admin` with a new `ADMIN_PASSWORD` in `.env`.
