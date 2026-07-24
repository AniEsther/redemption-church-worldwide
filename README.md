# The Redemption Church Worldwide — Full Site

This project has two parts:

```
redemption-church-worldwide/
├── frontend/   React + Vite site (what visitors see) + Admin Dashboard
└── backend/    Express + MongoDB API
```

## First-time setup

```bash
cd backend
cp .env.example .env      # fill in MONGO_URI and JWT_SECRET
cd ../frontend
cp .env.example .env      # VITE_API_URL should point at your backend
cd ..
npm run install:all       # installs both backend/ and frontend/ dependencies
```

Then create your admin login (used to sign in to `/admin`):
```bash
cd backend
npm run seed:admin        # uses ADMIN_EMAIL / ADMIN_PASSWORD from backend/.env
cd ..
```

Then populate the database with starter content (so the admin dashboard has
real, editable sermons/events/ministries/etc. instead of an empty list —
the public site shows sample content either way, but it isn't actually
editable until it exists in the database):
```bash
cd backend
npm run seed:content
cd ..
```
Safe to re-run — it only fills in collections that are still empty and
won't create duplicates.

## Running both at once

From the **root** folder:
```bash
npm run dev
```
This starts the backend (`http://localhost:5000`) and frontend
(`http://localhost:5173`) together in one terminal, labeled `BACKEND` and
`FRONTEND`. Stop both with `Ctrl+C`.

Prefer separate terminals? That still works:
```bash
# terminal 1
cd backend && npm run dev

# terminal 2
cd frontend && npm run dev
```

## Admin Dashboard

Visit `http://localhost:5173/admin/login` and sign in with the
`ADMIN_EMAIL` / `ADMIN_PASSWORD` you set in `backend/.env`. From there you
can manage:

- **Messages** — contact form submissions
- **Prayer Requests** — mark as prayed for
- **Subscribers** — newsletter signups
- **Sermons** — add/edit/delete, with file upload for thumbnail, audio, and downloads
- **Events** — add/edit/delete
- **Ministries** — add/edit/delete ("programs")
- **Testimonies** — approve or delete submitted testimonies before they go live
- **Gallery** — upload and delete photos

Anything added here shows up live on the public site (sermons, events,
ministries, gallery, and testimonies pages all pull from the database, and
fall back to sample content until you've added your own).

See `frontend/README.md` and `backend/README.md` for full details, including
the full API reference and how to add your logo.

## Adding your logo

Drop your logo file into `frontend/public/` and name it `logo.png`. The
navbar will pick it up automatically. If your file is a different format
(`.svg`, `.jpg`), tell me the filename and I'll update the reference in
`frontend/src/components/Navbar.jsx`.

## Colors

Brown, Orange, Light Yellow, Black, and White — defined as design tokens in
`frontend/tailwind.config.js` (`brown`, `orange`, `yellow`, `cream`, `ink`).
Edit the hex values there to fine-tune the palette.

## Deploying

- **Backend:** Render, Railway, or Fly.io. Set `MONGO_URI` (e.g. MongoDB
  Atlas free tier), `JWT_SECRET`, and `CLIENT_ORIGIN` to your live frontend
  domain.
- **Frontend:** Vercel or Netlify. Set `VITE_API_URL` to your live backend URL.
- Uploaded files (sermon audio, gallery photos) are currently stored on the
  backend server's local disk — fine for getting started, but most hosts
  wipe local disk on redeploy. For production, swap the upload storage in
  `backend/src/middleware/upload.js` for a cloud bucket (e.g. Cloudinary or
  S3) before you rely on it long-term.

