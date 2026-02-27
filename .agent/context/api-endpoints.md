# API Endpoints

Base URL: `${VITE_API_BASE}` for frontend; backend mounts routes under `/api/*`.

| Method | Path | Auth | Request Body | Response | Notes |
| --- | --- | --- | --- | --- | --- |
| GET | `/` | no | - | `{ message: string }` | Backend health info |
| GET | `/api/health` | no | - | `{ status: "ok" }` | Health check |
| GET | `/api/movies` | no | - | `Movie[]` | List all movies |
| POST | `/api/movies` | yes (Bearer) | `MovieDTO` | `Movie` | Requires auth |
| DELETE | `/api/movies/:id` | yes (Bearer) | - | `{ message: string }` | Deletes by id |
| POST | `/api/admin/login` | no | `{ username, password }` | `{ token }` | Admin login |
| POST | `/api/login` | no | `{ username, password }` | `{ token }` | Alias of admin login |

## Auth
- Header: `Authorization: Bearer <token>`
- Token: JWT signed with `JWT_SECRET` (1h expiry)

## DTOs
- `MovieDTO`: `title` (required), `director?`, `image_url?`, `rating?`, `year?`, `summary?`
- `AdminLogin`: `username`, `password`
