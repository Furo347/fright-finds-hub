# Environment Variables

## Backend
- `PORT`: server port (default 3000)
- `FRONTEND_ORIGIN`: comma-separated allowed origins or `*`
- `JWT_SECRET`: JWT signing secret (required in prod)
- `DB_DIALECT`: `mysql` (default) or `sqlite`
- `DB_HOST`: database host (mysql)
- `DB_NAME`: database name (mysql)
- `DB_USER`: database user (mysql)
- `DB_PASSWORD`: database password (mysql)
- `DB_STORAGE`: sqlite storage path (use `:memory:` for tests)
- `ADMIN_USERNAME`: admin username for init scripts
- `ADMIN_PASSWORD`: admin password for init scripts

## Frontend
- `VITE_API_BASE`: base URL for backend API

## Tests
- `BACKEND_URL`: backend base URL for Playwright tests

Notes:
- Do not store real secrets in repo.
