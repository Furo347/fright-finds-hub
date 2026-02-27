# Rule 01 - Backend API & DB (Express + Sequelize)

Scope: `backend/src`, `backend/test`

## Patterns obligatoires
- **Structure des couches**: `src/app.ts` cree l'app Express, `src/server.ts` ecoute le port; les routes vivent dans `src/routes`, la logique HTTP dans `src/controller`, l'acces DB dans `src/models`, et les middlewares dans `src/middleware`.
- **Middleware order**: CORS (avec liste d'origines via `FRONTEND_ORIGIN`) -> `app.options` -> `express.json()` -> routes.
- **Routing**: utiliser `Router()` par module et exporter par defaut; les prefixes `/api/*` sont definis dans `app.ts`.
- **Auth**: proteger les routes sensibles avec `auth` et un header `Authorization: Bearer <token>`; generer les JWT via `jsonwebtoken` et verifier dans le middleware.
- **Controllers**: fonctions `async (req, res)` avec `try/catch`, reponses JSON claires (`200/201/400/401/500`), pas d'exposition de stack trace.
- **Models/DTO**: definir les modeles Sequelize dans `src/models/index.ts`, exposer des DTOs (`MovieDTO`, `AdminDTO`) et convertir en JSON avant de repondre.
- **DB**: utiliser l'instance unique de `src/db.ts` (dialect via `DB_DIALECT`) et des scripts dedies (`initDb.ts`, `createAdmin.ts`) pour les seeds.

## Anti-patterns stricts
- Instancier un nouveau `Sequelize` ailleurs que `src/db.ts`.
- Ecrire des requetes SQL ou manipuler Sequelize directement dans les controllers/routes.
- Appeler `sync({ force: true })` en runtime hors tests/scripts.
- Logger des secrets (mots de passe, JWT, tokens) ou laisser `JWT_SECRET` par defaut en prod.
- Exposer des erreurs brutes ou renvoyer des objets Sequelize non serialises.

## Bibliotheques autorisees
- Runtime: `express`, `cors`, `dotenv`, `sequelize`, `bcrypt`, `jsonwebtoken`.
- Drivers: `mysql2`, `pg`, `sqlite3`, `better-sqlite3`.
- Tests: `jest`, `supertest`, `ts-jest`.
- Types: `@types/express`, `@types/jsonwebtoken`, `@types/bcrypt`, `@types/node`.
