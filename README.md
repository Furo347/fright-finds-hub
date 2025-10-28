# 🎬 Horror Movies Showcase

Un site web moderne réalisé avec **React** et **TypeScript**, permettant de présenter une sélection des **meilleurs films d’horreur**.  
Le projet a été conçu dans le cadre d’un cours visant à **apprendre le déploiement d’applications web sur Google Cloud Platform (GCP)**.

---

## 🚀 Fonctionnalités

- 🎥 **Affichage dynamique** des meilleurs films d’horreur
  - 🧛‍♂️ Présentation avec **affiches, synopsis, années de sortie et notes**
- 🔍 **Filtrage / tri** par année, note ou type de film (slasher, psychologique, paranormal...)
- 🖼️ Mise en avant de visuels attractifs (posters et fonds sombres pour l’ambiance)
- 📱 **Responsive design** pour mobile et desktop

---

## 🧰 Technologies utilisées

### Front-end
- ⚛️ **React** (avec TypeScript)
- 🎨 **CSS / TailwindCSS**
- 📦 **Vite**

### Déploiement & Cloud
- ☁️ **Google Cloud Platform (GCP)**
    - **Cloud Storage** pour héberger le site statique
    - *(ou Cloud Run, selon ton choix de déploiement)*
- 🔐 **IAM** pour la gestion des permissions publiques
- 🌍 URL publique générée via GCP

## 🏗️ Architecture Cloud

Le projet adopte une **architecture monolithique conteneurisée** déployée sur **Google App Engine** :

- Le **front-end** (React/Vite) est compilé dans le dossier `dist/` et servi en statique par App Engine.
- Le **back-end** (Express) est exécuté dans le même service pour simplifier la maintenance.
- La **base de données** repose sur un service managé **Cloud SQL (PostgreSQL)**.
- Les **images** sont hébergées sur **Cloud Storage**.

---

## ⚙️ Installation & Lancement

### 1️⃣ Cloner le projet
```bash
git clone https://github.com/ton-profil/horror-movies-showcase.git
cd horror-movies-showcase
```

### 2️⃣ Installer les dépendances
```bash
npm install
``` 

### 3️⃣ Lancer le projet en local
```bash 
npm run dev
```

### 🔐 Authentification Admin (API)

L'API protège l'ajout et la suppression de films via un JWT admin. Seuls les administrateurs authentifiés peuvent modifier la base de données.

#### 1️⃣ Configuration des variables d'environnement

Créez un fichier `.env` à la racine du projet avec les variables suivantes :

```env
# Identifiants admin (changez ces valeurs en production !)
ADMIN_USER=admin
ADMIN_PASS=password

# Secret JWT (changez-le en production !)
JWT_SECRET=dev-secret-change-me-in-production

# Base URL pour les images GCS (optionnel)
GCS_IMAGES_BASE=https://storage.googleapis.com/fright-finds-hub-images

# URL de base de données (optionnel - utilise SQLite par défaut)
# DB_URL=postgresql://user:password@localhost:5432/database
```

#### 2️⃣ Démarrage du serveur

```bash
npm run server
```

Le serveur sera accessible sur `http://localhost:3000`

#### 3️⃣ Authentification et utilisation

**Obtenir un token d'authentification :**

**PowerShell (Windows) :**
```powershell
$body = @{username="admin"; password="password"} | ConvertTo-Json
$response = Invoke-RestMethod -Uri "http://localhost:3000/api/login" -Method POST -Body $body -ContentType "application/json"
$token = $response.token
Write-Host "Token: $token"
```

**Bash/Linux/Mac :**
```bash
curl -X POST http://localhost:3000/api/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"password"}'
```

**Ajouter un nouveau film :**

**PowerShell :**
```powershell
$headers = @{"Authorization" = "Bearer $token"; "Content-Type" = "application/json"}
$movie = @{
  title="Mon Film d'Horreur"
  year=2024
  director="Réalisateur"
  rating=8.5
  genre="Horror"
  synopsis="Description du film..."
  imageUrl="https://exemple.com/image.jpg"
} | ConvertTo-Json
$response = Invoke-RestMethod -Uri "http://localhost:3000/api/movies" -Method POST -Headers $headers -Body $movie
Write-Host "Film créé avec ID: $($response.id)"
```

**Bash :**
```bash
curl -X POST http://localhost:3000/api/movies \
  -H "Authorization: Bearer VOTRE_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"Mon Film","year":2024,"director":"Réalisateur","rating":8.5,"genre":"Horror","synopsis":"Description","imageUrl":"https://exemple.com/image.jpg"}'
```

**Supprimer un film :**

**PowerShell :**
```powershell
$headers = @{"Authorization" = "Bearer $token"}
Invoke-RestMethod -Uri "http://localhost:3000/api/movies/ID_DU_FILM" -Method DELETE -Headers $headers
Write-Host "Film supprimé avec succès"
```

**Bash :**
```bash
curl -X DELETE http://localhost:3000/api/movies/ID_DU_FILM \
  -H "Authorization: Bearer VOTRE_TOKEN"
```

#### 📋 Routes API disponibles

| Méthode | Route | Authentification | Description |
|---------|-------|------------------|-------------|
| `GET` | `/api/health` | ❌ | Vérification de l'état du serveur |
| `GET` | `/api/movies` | ❌ | Liste tous les films |
| `POST` | `/api/login` | ❌ | Authentification admin (retourne un JWT) |
| `POST` | `/api/movies` | ✅ Admin | Créer un nouveau film |
| `DELETE` | `/api/movies/:id` | ✅ Admin | Supprimer un film |

#### 🔒 Sécurité

- **Token JWT** : Expire après 2 heures
- **Authentification** : Obligatoire pour les opérations d'écriture
- **Variables d'environnement** : Changez les valeurs par défaut en production
- **CORS** : Activé pour le développement (à configurer pour la production)

## 🧩 CI/CD

Le projet utilise **GitHub Actions** pour automatiser :
- le build du front (`vite build`),
- et le déploiement sur **Google App Engine**.

Chaque push sur la branche `main` déclenche la pipeline :
1. Installation des dépendances
2. Build du frontend
3. Authentification à GCP
4. Déploiement automatique via App Engine

Les logs de déploiement sont visibles dans l’onglet **Actions** du repo.

## 📈 Monitoring & Observabilité

L’application bénéficie d’un suivi automatique grâce aux outils intégrés de **Google Cloud Platform** :

- **Cloud Logging** : centralisation des logs du serveur Express.
- **Cloud Monitoring** : suivi des métriques de performance (CPU, latence, erreurs).
- **Stackdriver Error Reporting** : détection automatique des erreurs applicatives.

Ces outils sont configurés par défaut lors du déploiement sur App Engine et permettent
de surveiller la santé du service en temps réel sans configuration supplémentaire.

### 👨‍💻 Auteur

Projet réalisé par Florentin Portets
Étudiant en Master Développement Web — Projet GCP / React
📅 Année : 2025

### 🎨 Aperçu du site

Le site présente un design sombre et cinématographique, inspiré des affiches de films d’horreur classiques.
Chaque fiche film contient une image, un titre, une année et une courte description.

### 📜 Licence

Ce projet est distribué sous licence MIT.
Tu peux le modifier et le réutiliser librement à des fins pédagogiques.

https://fright-finds-hub.ew.r.appspot.com/
