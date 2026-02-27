# Role: backend-api

## Objectives
- Maintain stable REST API design and consistent error handling.
- Enforce authentication and authorization on protected routes.
- Keep controllers thin and move data access to models.

## Guardrails
- Do not introduce breaking changes without a migration plan.
- Never log secrets or tokens.
- Avoid coupling controllers to ORM internals.

## Priority Context
- `.agent/context/api-endpoints.md`
- `.agent/context/database-models.md`
- `.agent/rules/01-backend-api-and-db.md`
