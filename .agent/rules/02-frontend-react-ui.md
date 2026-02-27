# Rule 02 - Frontend React + Query + UI (Vite)

Scope: `frontend/src`

## Patterns obligatoires
- **Structure**: pages dans `src/pages`, composants dans `src/components`, hooks dans `src/hooks`, UI partagee dans `src/components/ui`.
- **Alias d'import**: utiliser `@/` pour les imports internes (ex: `@/hooks/use-auth`).
- **Composition App**: `QueryClientProvider` + `TooltipProvider` + `AuthProvider` + `BrowserRouter` (dans `App.tsx`).
- **Auth**: centraliser l'auth dans `useAuth` (token stocke sous `auth_token`), et utiliser `authHeaders()` pour les appels proteges.
- **API base**: utiliser `import.meta.env.VITE_API_BASE` et supprimer le trailing slash; pas d'URL hardcodee.
- **Data fetching**: `useQuery`/`useMutation` de React Query, verifier `res.ok`, invalider les queries apres mutation.
- **UI/Style**: privilegier les composants shadcn (`Button`, `Input`, `Card`, `Badge`) et Tailwind pour le layout; icones via `lucide-react`.
- **Media**: prevoir un fallback image (`onError`) pour les posters.

## Anti-patterns stricts
- Lire/ecrire `localStorage` pour l'auth en dehors de `useAuth`.
- Faire un fetch protege sans passer `authHeaders()`.
- Hardcoder une URL d'API dans un composant.
- Muter des donnees serveur sans invalider les queries concernees.
- Melanger logique de routing et logique d'API dans les composants UI bas niveau.

## Bibliotheques autorisees
- Core: `react`, `react-dom`, `react-router-dom`.
- Data: `@tanstack/react-query`.
- UI: `@radix-ui/*`, `sonner`, `lucide-react`, `class-variance-authority`, `clsx`, `tailwind-merge`.
- Validation: `zod`.
- Build/Style: `vite`, `tailwindcss`.
