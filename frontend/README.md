# CampusConnect — Frontend

React + Tailwind CSS frontend for CampusConnect, built to match the real
FastAPI backend at https://github.com/madhur2284/CampusConnect.

No cart, no payment gateway, no checkout — a signed-in student posts an item
with a photo and price; anyone browsing the board messages them directly on
WhatsApp to work out the sale.

## Architecture

Four-layer structure under `src/`:

```
src/
  components/    Reusable, "dumb" UI building blocks (Button, Input, Navbar, ...)
  features/      Domain logic, one folder per feature
    auth/        AuthContext, forms, API calls, ProtectedRoute
    products/    Product feed, form, API calls, pagination hooks
  pages/         Route-level screens that compose components + features
  styles/        Global Tailwind entrypoint (the corkboard/paper theme)
  lib/           apiClient.js — the single axios instance + token refresh
  utils/         Framework-agnostic helpers (validators, error formatting)
```

`lib` and `utils` sit underneath the four main layers as shared plumbing so
`features` and `pages` never talk to axios or localStorage directly.

## Setup

```bash
npm install
cp .env.example .env   # already points at http://localhost:8000
npm run dev
```

Run the backend first (see the backend README) — the frontend expects it at
`VITE_API_BASE_URL` (defaults to `http://localhost:8000`).

## Routes

| Path            | Page              | Auth required |
|-----------------|-------------------|---------------|
| `/`             | Product feed      | No            |
| `/login`        | Log in            | No            |
| `/register`     | Create account    | No            |
| `/sell`         | Post an item      | Yes           |
| `/my-listings`  | Manage own items  | Yes           |
| `*`             | 404               | No            |

## Backend contract this frontend was built against

**Auth** (`/auth`, see `app/routers/auth.py`)
- `POST /auth/register` — JSON `{ username, password, contact_number, name, college }`
- `POST /auth/login` — `application/x-www-form-urlencoded` `{ username, password }` (OAuth2 password flow, **not JSON**)
- `POST /auth/refresh?token=<refresh_token>` — refresh token as a query param
- `POST /auth/logout` — auth required
- `POST /auth/change_password` — auth required, JSON `{ old_password, new_password }`
- `GET /auth/me` — auth required, returns `{ id, username, contact_number, name, college }`

**Products** (`/product`, see `app/routers/product.py`)
- `GET /product/items?page=<n>` — paginated: `{ page_number, total_pages, has_previous, has_next, data: Product[] }`
- `POST /product/items` — auth required, **`multipart/form-data`**: `title`, `price`, `description` as form fields + `image` as a file (max 2MB, jpeg/png/webp/jpg only)
- `GET /product/items/me?page=<n>` — auth required, same paginated shape, only the caller's own listings
- `DELETE /product/items/{id}` — auth required, soft-deletes (`is_active = false`)

`Product` shape: `{ id, seller_id, seller_contact_number, seller_name, seller_college, title, image_url, image_public_id, price, description, created_at }`


Everything else (register, login, refresh, logout, browsing, posting an item
with a real photo upload, viewing/deleting your own listings) is wired up
and ready to run against the backend as it stands today.
