# Vikas U Desai Real Estate & Finance Consultancy

A React website and admin CMS for Vikas U Desai Real Estate & Finance Consultancy, serving Mira Road and nearby communities. The frontend is built with React and Vite; the API is an Express server with SQLite persistence.

## Requirements

- Node.js **22.9 or newer** (needed for `node:sqlite` and the `.env` file option used by the server script)
- npm

## Run locally

1. Install dependencies:

   ```sh
   npm install
   ```

2. Create a local environment file and set a private admin password. Do not commit `.env`:

   ```sh
   cp .env.example .env
   ```

   Edit `.env` and replace the example password. You can also set `ADMIN_USERNAME`, `EDITOR_USERNAME`, and `EDITOR_PASSWORD`.

3. Start the frontend and backend together:

   ```sh
   npm run dev:all
   ```

4. Open the public website at <http://localhost:5173/>. The admin CMS is at <http://localhost:5173/admin>.

Stop both local servers with **Ctrl+C** in the terminal.

### Run services separately

```sh
npm run server  # Express API at http://localhost:4000
npm run dev     # Vite frontend at http://localhost:5173
```

The Vite development server proxies `/api` requests to the Express server.

## Available commands

| Command | Purpose |
| --- | --- |
| `npm run dev:all` | Start frontend and backend for local development |
| `npm run dev` | Start the Vite frontend only |
| `npm run server` | Start the Express API only |
| `npm run build` | Create a production frontend build in `dist/` |
| `npm run preview` | Preview the built frontend locally |
| `npm run lint` | Run Oxlint |

## Website pages

- `/` — Home, featured projects and properties, services, reviews, and service areas
- `/about` — Consultancy and founder information
- `/properties` — Property listings; `/properties/:id` — property details
- `/projects` — Projects; `/projects/:id` — project details
- `/services` — Consultancy services
- `/reviews` — Reviews
- `/blog` — Articles; `/blog/:slug` — article details
- `/contact` — Contact details and enquiry form
- `/admin` — Admin/editor login and CMS

The Home page's service-area data is in `src/data/areas.js`, with Mira Road neighbourhoods and nearby areas maintained separately.

## Project structure

```text
src/
  assets/          Local images and assets
  components/      Shared React UI components
  context/         Shared CMS content state
  data/            Seed and fallback website content
  pages/           Route-level pages
  services/        Frontend API client
  App.css          Shared component and admin styles
  public-theme.css Public website design layer
  index.css        Global styles
server/
  index.js         Express API, authentication, validation, and SQLite setup
  data/            Local SQLite database (created at runtime; do not commit)
```

## Backend and persistence

The API defaults to `http://localhost:4000`. SQLite is stored at `server/data/app.db` unless `DATABASE_PATH` is set. The server creates tables for users, CMS content (projects, properties, blog posts, reviews, and services), appointments, enquiries, and leads.

Admin credentials are configured through environment variables. Local development defaults exist in the server for convenience; set a strong, unique `ADMIN_PASSWORD` (and editor password if used) before using the admin account with real information. Never publish credentials or commit `.env`.

Useful API endpoints include:

- `GET /api/health` — API health check
- `GET /api/content` — public CMS content
- `POST /api/admin/login`, `GET /api/admin/session`, `POST /api/admin/logout` — admin session
- `GET /api/admin/content`, `PUT /api/admin/content` — CMS read/write
- `POST /api/appointments`, `POST /api/enquiries`, `POST /api/whatsapp-lead` — public submissions
- `GET /api/appointments`, `GET /api/enquiries`, `GET /api/leads` — protected admin records

## Environment variables

See `.env.example`. Supported settings include:

| Variable | Purpose |
| --- | --- |
| `PORT` | API port; defaults to `4000` |
| `ADMIN_USERNAME` | Admin login username |
| `ADMIN_PASSWORD` | Admin login password; set a strong secret |
| `EDITOR_USERNAME` | Editor login username |
| `EDITOR_PASSWORD` | Editor login password |
| `FRONTEND_ORIGIN` | Allowed browser origin(s), comma-separated |
| `DATABASE_PATH` | SQLite database path; defaults to `server/data/app.db` |
| `NODE_ENV` | Set to `production` for production cookie behavior |

## Deployment notes

The local setup is intended for development. Before public deployment, configure secrets outside source control, use HTTPS, set `NODE_ENV=production` and `FRONTEND_ORIGIN` to the exact site origin, and ensure the SQLite database directory is on durable writable storage and backed up. This server uses in-memory sessions and login throttling, so a restart invalidates sessions and a multi-instance deployment needs shared session storage and a database strategy designed for that deployment. Review authentication/password hashing and operational security before exposing the admin API publicly.
