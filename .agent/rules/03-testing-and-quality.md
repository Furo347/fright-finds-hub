# Rule 03 - Tests & Qualite (Jest + Supertest + Playwright)

Scope: `backend/test`, `frontend/src/tests`

## Patterns obligatoires
- **Backend unit tests**: utiliser `jest` + `supertest` avec des mocks de modeles (ex: `jest.mock('../src/models/...')`).
- **Backend integration**: basculer en SQLite in-memory via env (`DB_DIALECT=sqlite`, `DB_STORAGE=:memory:`), faire `sequelize.sync({ force: true })` dans le `beforeAll`, et fermer le serveur/DB en `afterAll`.
- **Frontend e2e**: Playwright avec `page.route` pour mocker les API ou `request.post` pour obtenir un token; stocker `auth_token` dans `localStorage` et recharger la page.
- **Assertions**: preferer `expect(...).toBeVisible({ timeout: ... })` pour eviter les flakies.
- **Isolation**: chaque test prepare ses donnees et n'utilise pas d'etat global cache.

## Anti-patterns stricts
- Tests qui dependent d'Internet ou d'APIs externes non mockees.
- Laisser un serveur ouvert apres les tests.
- Partager une DB locale persistante entre tests d'integration.
- Omettre les verifications de `res.ok`/status avant d'utiliser la reponse.

## Bibliotheques autorisees
- Backend: `jest`, `supertest`, `ts-jest`.
- Frontend: `@playwright/test`.
- Tooling: `cross-env` (scripts), `ts-jest`.
