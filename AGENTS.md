# AGENTS.md - Bootloader

> **A lire en premier.** Ce fichier explique comment charger la connaissance locale et naviguer dans l'architecture `.agent/`.

## Ordre de lecture recommande
1. `.agent/system/alignment.md`
2. `.agent/system/orchestrator.md`
3. `.agent/system/auto-learning.md`
4. La/les regles pertinentes dans `.agent/rules/`

## Apercu rapide du projet
- **Backend**: Node.js + Express + Sequelize (dossier `backend/`).
- **Frontend**: Vite + React + Tailwind + React Query (dossier `frontend/`).

## Dependances
### Backend (`backend/package.json`)
- **dependencies**: bcrypt, better-sqlite3, cors, dotenv, express, jsonwebtoken, mysql2, pg, sequelize, sqlite3
- **devDependencies**: jest, nodemon, supertest, ts-jest, typescript, ts-node, ts-node-dev, @types/bcrypt, @types/express, @types/jest, @types/node, @types/supertest, @types/jsonwebtoken, @types/cors

### Frontend (`frontend/package.json`)
- **dependencies**: @radix-ui/react-slot, @radix-ui/react-toast, @radix-ui/react-tooltip, @tanstack/react-query, better-sqlite3, class-variance-authority, clsx, concurrently, cors, dotenv, express, jsonwebtoken, lucide-react, pg, react, react-day-picker, react-dom, react-router-dom, sonner, tailwind-merge, tailwindcss-animate, zod
- **devDependencies**: @eslint/js, @playwright/test, @types/jest, @types/node, @types/react, @types/react-dom, @vitejs/plugin-react-swc, autoprefixer, cross-env, eslint, eslint-plugin-react-hooks, eslint-plugin-react-refresh, globals, jest, postcss, supertest, tailwindcss, ts-jest, typescript, typescript-eslint, vite

## Glossaire des Fichiers (WHY)
- `.agent/` - Racine du "Second Brain". **WHY:** point d'entree pour tous les standards locaux.
- `.agent/system/` - Regles immuables de comportement. **WHY:** aligner l'agent avant toute action.
- `.agent/system/alignment.md` - Principes d'alignement globaux. **WHY:** eviter erreurs de securite/qualite.
- `.agent/system/orchestrator.md` - Gestion du contexte et impacts. **WHY:** limiter la charge cognitive et les effets de bord.
- `.agent/system/auto-learning.md` - Mise a jour continue du contexte. **WHY:** garder la doc vivante apres chaque changement.
- `.agent/rules/` - Standards de code specifiques au projet. **WHY:** suivre les conventions locales.
- `.agent/rules/01-backend-api-and-db.md` - Standards backend (Express/Sequelize). **WHY:** coder en coherence avec l'API et la DB existantes.
- `.agent/rules/02-frontend-react-ui.md` - Standards frontend (React/Query/UI). **WHY:** garder une UX/architecture coherentes.
- `.agent/rules/03-testing-and-quality.md` - Standards de tests. **WHY:** maintenir la qualite sans flakies.
- `.agent/context/` - Cartographies (BDD, routes, etc.). **WHY:** comprendre vite sans re-scanner tout le repo.
- `.agent/workflows/` - Procedures pas-a-pas. **WHY:** executer des taches complexes de maniere reproductible.
- `.agent/templates/` - Modeles (ADR, PR, RCA, etc.). **WHY:** accelerer la redaction standardisee.
- `AGENTS.md` - Bootloader. **WHY:** c'est le point d'entree et l'index des regles.

---

Question: Quelles regles d'architecture ou de securite veux-tu ajouter manuellement ?
