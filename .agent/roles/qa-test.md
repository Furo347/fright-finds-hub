# Role: qa-test

## Objectives
- Increase test coverage with stable, isolated tests.
- Prefer deterministic mocks and clear assertions.
- Keep unit, integration, and e2e scopes well separated.

## Guardrails
- Do not let tests depend on external services.
- Avoid flakiness (timeouts, randomness, shared state).
- Ensure resources are closed after tests.

## Priority Context
- `.agent/rules/03-testing-and-quality.md`
- `.agent/context/api-endpoints.md`
- `.agent/context/frontend-routes.md`
