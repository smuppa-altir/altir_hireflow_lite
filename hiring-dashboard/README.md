# HireFlow

Production-ready Hiring Management System frontend built with React, TypeScript, and Vite.

## Stack

- **React 19** + **TypeScript**
- **Vite** — build tooling
- **Tailwind CSS v4** — styling
- **React Router DOM v7** — routing
- **Axios** — API layer
- **Lucide React** — icons

## Project structure

```
src/
├── assets/          # Static assets
├── components/      # Reusable UI components
│   ├── ui/          # Primitives (Button, Input, Card, etc.)
│   ├── common/      # Shared composites (PageHeader, StatCard)
│   ├── candidates/  # Domain components
│   ├── jobs/
│   └── navigation/  # Sidebar, MobileNav
├── constants/       # Routes, API endpoints, status labels
├── context/         # Auth & Theme providers
├── hooks/           # Custom hooks (useAuth, useCandidates, etc.)
├── layouts/         # AppLayout, AuthLayout
├── pages/           # Route-level pages
├── routes/          # Router config & ProtectedRoute
├── services/        # Axios client & API services
├── types/           # TypeScript interfaces
└── utils/           # Helpers (cn, formatters, storage)
```

## Getting started

```bash
npm install
cp .env.example .env
npm run dev
```

Open [http://localhost:5173](http://localhost:5173). Sign in with any email/password (mock auth enabled by default).

## Environment variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_BASE_URL` | Backend API base URL | `http://localhost:3000/api` |
| `VITE_USE_MOCK` | Use mock data (`false` to hit real API) | enabled |
| `VITE_APP_NAME` | Application name | `HireFlow` |

## Scripts

- `npm run dev` — start dev server
- `npm run build` — production build
- `npm run preview` — preview production build
- `npm run lint` — ESLint

## Features

- Dashboard with hiring pipeline stats
- Candidate list, search, filters, and detail views
- Job postings with status management
- Interview schedule
- Settings (profile, theme)
- Dark / light mode
- Mobile-responsive sidebar navigation
- Protected routes with auth context
- Axios interceptors for auth tokens

## Connecting to a backend

Set `VITE_USE_MOCK=false` and configure `VITE_API_BASE_URL` to your API. Services expect responses shaped as:

```json
{ "data": { ... } }
```

for single resources, and paginated lists as:

```json
{ "data": { "data": [], "total": 0, "page": 1, "pageSize": 10, "totalPages": 1 } }
```
