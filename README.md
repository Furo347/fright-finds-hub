# fright-finds-hub

Application web de gestion de films d'horreur, composée d'un **backend Express/Sequelize** et d'un **frontend Vite/React**.

---

## 🌐 Production

| Service | URL |
|---------|-----|
| **Frontend** | https://horrordb-front.ew.r.appspot.com |
| **Backend API** | https://api.13-48-55-141.sslip.io |

---

## 🗂️ Structure du projet

```
fright-finds-hub/
├── docker-compose.yml
├── backend/          # API REST (Express + Sequelize)
└── frontend/         # Interface utilisateur (Vite + React + Tailwind)
```

---

## ⚙️ Stack technique

### Backend
- **Runtime** : Node.js avec TypeScript (`ts-node-dev`)
- **Framework** : Express 5
- **ORM** : Sequelize 6
- **Bases de données supportées** : MySQL (défaut), SQLite (prod/tests)
- **Auth** : JWT (`jsonwebtoken`) + hashage bcrypt
- **Tests** : Jest + Supertest

### Frontend
- **Bundler** : Vite 5
- **UI** : React 18 + Tailwind CSS + shadcn/ui (Radix UI)
- **Routing** : React Router DOM v6
- **Data fetching** : TanStack Query v5
- **Tests** : Playwright (e2e) + Jest

---

## 🚀 Quick start (PowerShell)

### 1. Backend

```powershell
cd backend
npm install
cp .env.example .env   # puis éditer les valeurs
npm run migrate:init
npm run admin:create
npm run dev
# → http://localhost:3000
```

### 2. Frontend

```powershell
cd frontend
npm install
npm run dev
# → http://localhost:8080
```

> Le proxy Vite redirige automatiquement `/api` vers `http://localhost:3000` (configurable via `API_PORT`).

---

## 🔑 Variables d'environnement

### `backend/.env`

| Variable          | Défaut              | Description                                       |
|-------------------|---------------------|---------------------------------------------------|
| `PORT`            | `3000`              | Port d'écoute du serveur                          |
| `DB_DIALECT`      | `mysql`             | Dialecte Sequelize : `mysql` ou `sqlite`          |
| `DB_HOST`         | `127.0.0.1`         | Hôte MySQL                                        |
| `DB_USER`         | —                   | Utilisateur MySQL                                 |
| `DB_PASSWORD`     | —                   | Mot de passe MySQL                                |
| `DB_NAME`         | —                   | Nom de la base de données MySQL                   |
| `DB_STORAGE`      | `:memory:`          | Chemin du fichier SQLite (si `DB_DIALECT=sqlite`) |
| `JWT_SECRET`      | `secret`            | Clé secrète pour signer les JWT                   |
| `FRONTEND_ORIGIN` | `http://localhost:8080` | Origines CORS autorisées (séparées par `,`) |
| `ADMIN_USERNAME`  | —                   | Nom d'utilisateur admin                           |
| `ADMIN_PASSWORD`  | —                   | Mot de passe admin                                |

### `frontend/.env` (optionnel)

| Variable        | Défaut | Description                                          |
|-----------------|--------|------------------------------------------------------|
| `VITE_API_BASE` | `""`   | URL complète de l'API. Si vide, le proxy Vite est utilisé. |
| `API_PORT`      | `3000` | Port du backend (utilisé par le proxy Vite)          |

---

## 📡 Endpoints API

### Auth
| Méthode | Route          | Auth | Description              |
|---------|---------------|------|--------------------------|
| `POST`  | `/api/login`  | Non  | Connexion admin → JWT    |

### Films
| Méthode  | Route              | Auth | Description              |
|----------|--------------------|------|--------------------------|
| `GET`    | `/api/movies`      | Non  | Liste tous les films     |
| `POST`   | `/api/movies`      | Oui  | Ajoute un film           |
| `DELETE` | `/api/movies/:id`  | Oui  | Supprime un film         |

### Divers
| Méthode | Route         | Description         |
|---------|--------------|---------------------|
| `GET`   | `/api/health` | Health check        |
| `GET`   | `/`           | Statut du backend   |

> Les routes nécessitant une auth attendent un header `Authorization: Bearer <token>`.

---

## 🧪 Tests

### Backend (Jest + Supertest)
```powershell
cd backend
npm test
```

### Frontend — tests e2e (Playwright)
```powershell
cd frontend
npm run test:e2e
```

---

## 🐳 Docker Compose

Lance le backend + une base MySQL en local :

```powershell
docker-compose up --build
```

| Service   | Port exposé | Description          |
|-----------|-------------|----------------------|
| `db`      | `3306`      | MySQL 8.0            |
| `backend` | `3000`      | API Express          |

---

## 📜 Scripts disponibles

### Backend (`backend/`)

| Commande              | Description                                      |
|-----------------------|--------------------------------------------------|
| `npm run dev`         | Démarrage en mode dev (rechargement automatique) |
| `npm run build`       | Compilation TypeScript → `dist/`                 |
| `npm run start`       | Démarrage du build compilé                       |
| `npm run migrate:init`| Initialise les tables en base                    |
| `npm run admin:create`| Crée un compte administrateur                    |
| `npm test`            | Lance les tests Jest                             |

### Frontend (`frontend/`)

| Commande              | Description                            |
|-----------------------|----------------------------------------|
| `npm run dev`         | Serveur de développement (port 8080)   |
| `npm run build`       | Build de production                    |
| `npm run preview`     | Prévisualisation du build              |
| `npm run lint`        | Analyse ESLint                         |
| `npm run test:e2e`    | Tests end-to-end Playwright            |

---

## 🔄 CI/CD — Vue d'ensemble

| Fichier | Rôle | Déclenchement |
|---|---|---|
| `.github/workflows/ci.yml` | Tests backend + build + push image Docker sur GHCR | push `main` + PR |
| `.github/workflows/deploy-ec2.yml` | Déploiement backend sur AWS EC2 | push `main` |
| `.github/workflows/deploy.yml` | Déploiement frontend sur GCP App Engine | push `main` |

---

## ☁️ Déploiement

### Frontend → Google Cloud App Engine

Déployé automatiquement via `.github/workflows/deploy.yml`.

```
push main
   │
   ├── 1. Checkout du code
   ├── 2. Setup Node.js 20
   ├── 3. Génération du .env.production
   │       └── VITE_API_BASE=https://api.13-48-55-141.sslip.io
   ├── 4. Copie des images src/assets/ → public/assets/
   ├── 5. npm ci + npm run build (build Vite → dist/)
   ├── 6. Authentification GCP (Service Account)
   └── 7. Deploy sur App Engine (projet : horrordb-front)
           └── → https://horrordb-front.ew.r.appspot.com
```

#### Secrets GitHub requis

| Secret        | Description                               |
|---------------|-------------------------------------------|
| `GCP_SA_KEY`  | Clé JSON du Service Account Google Cloud |

---

### Backend → AWS EC2

Déployé automatiquement via `.github/workflows/deploy-ec2.yml`.

```
push main
   │
   ├── 1. Checkout du code
   ├── 2. Login GitHub Container Registry (GHCR)
   ├── 3. docker build + docker push → ghcr.io/furo347/fright-finds-backend:latest
   └── 4. SSH sur EC2 :
           ├── Installation Nginx + Certbot (1ère fois uniquement)
           ├── Configuration reverse proxy HTTPS (Nginx → localhost:3000)
           ├── Certificat SSL Let's Encrypt via sslip.io
           ├── docker login ghcr.io
           ├── docker pull ghcr.io/furo347/fright-finds-backend:latest
           ├── docker stop/rm (ancien conteneur)
           ├── docker run -d -p 3000:3000 (SQLite + CORS + admin)
           └── docker image prune -f
```

#### Secrets GitHub requis

| Secret        | Description                                |
|---------------|--------------------------------------------|
| `EC2_HOST`    | DNS public de l'instance EC2               |
| `EC2_USER`    | Utilisateur SSH (ex : `ec2-user`)          |
| `EC2_SSH_KEY` | Clé privée SSH (contenu du fichier `.pem`) |

> ⚠️ Le `GITHUB_TOKEN` est utilisé automatiquement pour GHCR (`packages: write`).
> Les ports **22, 80, 443 et 3000** doivent être ouverts dans le Security Group AWS.

#### Architecture réseau

```
Frontend (GCP HTTPS)
        ↓
https://api.13-48-55-141.sslip.io  (Nginx + Let's Encrypt)
        ↓
http://localhost:3000  (Docker container Node.js)
        ↓
SQLite  /app/data/db.sqlite  (volume Docker persistant)
```
