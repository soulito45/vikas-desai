# React + Vite

## Running securely

1. Copy `.env.example` to `.env` and set a long, unique `ADMIN_PASSWORD`.
2. Start both services with `npm run dev:all`.
3. Open `/admin` and sign in with that password. Content saved from the dashboard is served to the public pages after their next refresh.

For production, serve the frontend and `/api` from the same HTTPS origin, set `NODE_ENV=production`, and set `FRONTEND_ORIGIN` to the exact public site URL. The included server stores content, sessions, and leads in memory only; replace these arrays with a database before deployment so restarts do not lose data and multiple server instances stay consistent.

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and Oxlint's TypeScript related rules in your project.
