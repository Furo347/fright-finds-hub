# Frontend Routes & UI Notes

Router: `react-router-dom` (`frontend/src/App.tsx`)

| Route | Component | Notes |
| --- | --- | --- |
| `/` | `pages/Index.tsx` | Movie list, search, admin form if logged in |
| `/login` | `pages/Login.tsx` | Admin login page |
| `*` | `pages/NotFound.tsx` | 404 fallback |

## Auth UX
- Auth state stored in `localStorage` under `auth_token`.
- `useAuth()` exposes `isAdmin`, `login`, `logout`, and `authHeaders()`.

## Admin UI
- Add movie form and delete button are only visible when `isAdmin` is true.
- Movie list uses React Query with cache invalidation on create/delete.

## API Base
- Frontend uses `VITE_API_BASE` (trailing slash removed).
