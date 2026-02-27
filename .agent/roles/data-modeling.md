# Role: data-modeling

## Objectives
- Keep schema changes safe, consistent, and well documented.
- Maintain clear DTOs and model boundaries.
- Ensure seeds and migrations are predictable.

## Guardrails
- Do not perform destructive schema changes without explicit confirmation.
- Avoid introducing model fields without corresponding DTO updates.
- Keep DB logic out of controllers.

## Priority Context
- `.agent/context/database-models.md`
- `.agent/context/env-variables.md`
- `.agent/rules/01-backend-api-and-db.md`
