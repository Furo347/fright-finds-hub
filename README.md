# fright-finds-hub (split)

Ce dépôt est maintenant organisé en deux parties :


- `backend/` : API Express + Sequelize (MySQL)
- `frontend/` : Vite + React app

Quick start (PowerShell)

1. Backend

```powershell
cd backend
npm install
# configurer ./backend/.env (DB_* et FRONTEND_ORIGIN)
npm run start
```

2. Frontend

```powershell
cd frontend
npm install
npm run dev
# ouvre http://localhost:8080
```

Notes
- Le proxy Vite redirige `/api` vers `http://localhost:3000` (voir `frontend/vite.config.ts`).
- Frontend par défaut écoute sur le port 8080.
- Backend lit `FRONTEND_ORIGIN` depuis `backend/.env` pour configurer CORS.

Si tu veux que j'exécute les tests e2e ou que je crée les fichiers Docker, dis‑le.
