# fright-finds-hub

Application web de gestion de films d'horreur, composée d'un **backend Express/Sequelize** et d'un **frontend Vite/React**.

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
- **Bases de données supportées** : MySQL (défaut), SQLite (tests)
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

# Créer le fichier d'environnement (voir section Variables d'environnement)
cp .env.example .env   # puis éditer les valeurs

# Initialiser la base de données
npm run migrate:init

# (Optionnel) Créer un compte admin
npm run admin:create

# Démarrer en mode développement
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
| `FRONTEND_ORIGIN` | `http://localhost:8080` | Origines CORS autorisées (séparées par `,`, `*` pour tout autoriser) |
| `ADMIN_USERNAME`  | —                   | Nom d'utilisateur admin (pour `admin:create`)     |
| `ADMIN_PASSWORD`  | —                   | Mot de passe admin (pour `admin:create`)          |

### `frontend/.env` (optionnel)

| Variable        | Défaut | Description                                          |
|-----------------|--------|------------------------------------------------------|
| `VITE_API_BASE` | `""`   | URL complète de l'API (ex: `https://mon-api.com`). Si vide, le proxy Vite est utilisé. |
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
# ou
npm run e2e
```

---

## 🐳 Docker Compose

Lance le backend + une base MySQL en un seul service :

```powershell
docker-compose up --build
```

Services démarrés :

| Service   | Port exposé | Description          |
|-----------|-------------|----------------------|
| `db`      | `3306`      | MySQL 8.0            |
| `backend` | `3000`      | API Express          |

> Le frontend n'est **pas** inclus dans le Docker Compose — il est déployé séparément sur **Google Cloud App Engine** (voir section Déploiement ci-dessous).

Variables injectées dans le conteneur `backend` (voir `docker-compose.yml`) :

```
DB_HOST=db | DB_USER=root | DB_PASSWORD=example | DB_NAME=fright_db
DB_DIALECT=mysql | FRONTEND_ORIGIN=https://horrordb-front.ew.r.appspot.com
ADMIN_USERNAME=admin | ADMIN_PASSWORD=password
```

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
| `npm run preview`     | Prévisualisation du build (port 5173)  |
| `npm run lint`        | Analyse ESLint                         |
| `npm run test:e2e`    | Tests end-to-end Playwright            |
| `npm test`            | Tests Jest                             |

---

## 🔄 CI/CD — Vue d'ensemble

Tous les workflows sont déclenchés sur **push `main`** (et les PRs pour le CI) :

| Fichier | Rôle | Déclenchement |
|---|---|---|
| `.github/workflows/ci.yml` | Tests backend + build image Docker | push `main` + PR |
| `.github/workflows/deploy-ec2.yml` | Déploiement backend sur AWS EC2 | push `main` |
| `.github/workflows/deploy.yml` | Déploiement frontend sur GCP App Engine | push `main` |

> Le `ci.yml` est particulièrement utile sur les **Pull Requests** pour valider le code avant merge.

---

## ☁️ Déploiement

### Frontend → Google Cloud App Engine (CI/CD automatique)

Le frontend est déployé automatiquement sur **Google Cloud App Engine** via GitHub Actions (`.github/workflows/deploy.yml`).

#### Déclenchement
- À chaque **push sur `main`**

#### Pipeline CI/CD

```
push main
   │
   ├── 1. Checkout du code
   ├── 2. Setup Node.js 20
   ├── 3. Génération du .env.production
   │       └── VITE_API_BASE=http://ec2-13-48-55-141.eu-north-1.compute.amazonaws.com:3000
   ├── 4. npm ci + npm run build (build Vite → dist/)
   ├── 5. Authentification GCP (Service Account)
   └── 6. Deploy sur App Engine (projet : horrordb-front)
           └── → https://horrordb-front.ew.r.appspot.com
```

#### Secrets GitHub requis

| Secret        | Description                                      |
|---------------|--------------------------------------------------|
| `GCP_SA_KEY`  | Clé JSON du Service Account Google Cloud        |

Configuration (`frontend/app.yaml`) :
- **Runtime** : Node.js 20
- **Scaling** : 0 à 3 instances automatiques
- **Fichiers servis** : dossier `dist/` (build Vite)

### Backend → AWS EC2 (CI/CD automatique)

Le backend est déployé automatiquement sur une **instance AWS EC2** via GitHub Actions (`.github/workflows/deploy-ec2.yml`).

#### Déclenchement
- À chaque **push sur `main`**
- Manuellement via `workflow_dispatch`

#### Pipeline CI/CD

```
push main
   │
   ├── 1. Checkout du code
   ├── 2. Login GitHub Container Registry (GHCR)
   ├── 3. docker build + docker push → ghcr.io/furo347/fright-finds-backend:latest
   └── 4. SSH sur EC2 :
           ├── docker login ghcr.io
           ├── docker pull ghcr.io/furo347/fright-finds-backend:latest
           ├── docker stop/rm (ancien conteneur)
           ├── docker run -d -p 3000:3000 fright-finds-backend
           └── docker image prune -f
```

#### Secrets GitHub requis

| Secret           | Description                                      |
|------------------|--------------------------------------------------|
| `EC2_HOST`       | DNS public de l'instance EC2                     |
| `EC2_USER`       | Utilisateur SSH (ex : `ec2-user`)                |
| `EC2_SSH_KEY`    | Clé privée SSH (contenu du fichier `.pem`)       |

> ⚠️ Le `GITHUB_TOKEN` est utilisé automatiquement pour pusher sur GHCR (permission `packages: write`).
> Le conteneur Docker est exposé sur le **port 3000**. Penser à ouvrir ce port dans le **Security Group** AWS.

