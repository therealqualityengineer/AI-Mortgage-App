# CODING_STANDARDS.md

## General
- Concise code. Minimal comments. Production quality.
- Update `.ai/` context files on any architectural or workflow change.

## Backend (.NET 8 / C#)
- Nullable reference types: enabled.
- Implicit usings.
- Namespaces exactly match folder structure (e.g. `AI.Mortgage.Application.Customers`).
- PascalCase for public members, interfaces prefixed `I`.
- Services: Define interface + implementation in same namespace/folder. Prefer constructor injection.
- Use `Result<T>` for all application-layer operations (success + optional error).
- Controllers are thin: only map Result to HTTP responses. No business logic.
- EF Core:
  - Schema-qualified tables: `identity.*`, `customer.*`, `public.AuditEntries`.
  - Columns: snake_case (e.g. `first_name`).
  - PKs: `Guid` (UUID) for identity + customers. `ValueGeneratedOnAdd`.
  - Audit fields on all tables: `created_at`, `updated_at`, `created_by`, `updated_by`, `is_active`.
  - Indexes: unique on natural keys (username, email, role name); composite for name searches.
- JSON: camelCase (configured globally).
- Auth: JWT Bearer. Passwords via `PasswordHasher<TUser>` (PBKDF2). Never store plain text.
- Validation: Centralized in Application services (names required, uniqueness for email/phone). Return `Result<T>.Failure(...)`.
- Error responses: `{ success: false, message: "..." }` or 404 for not-found.
- Seeding: Idempotent via `SeedData.Initialize` (only on first run for 'arunqa').
- No static mutable state. No hard-coded connection strings or secrets in source.

## Frontend (React 19 + TS + Vite)
- Functional components + hooks only.
- TypeScript for all props/state. No prop-types.
- Controlled forms. Validation at component or page level (currently basic name checks).
- Centralized API URL in `src/config.ts`.
- Hash-based routing (custom parser in App.tsx). Routes typed via `src/types/route.ts`.
- Reusable components in `src/shared/components`. Export via index.
- Styling: Currently inline + CSS modules. Use `data-testid` on interactive elements for automation.
- No hard-coded backend URLs. Always import from config.
- Store auth token/user in localStorage after login. Send Bearer token on protected fetches.

## Database Naming
- Schemas: `identity`, `customer`, `public`.
- Tables: plural snake_case (`users`, `customers`).
- Columns: snake_case.
- PK: `id` (uuid or sequential where chosen).
- Indexes: `ix_<table>_<columns>`.

## UUID Usage
- All primary keys are `Guid` (PostgreSQL uuid).
- Generated client or server (EF ValueGeneratedOnAdd).
- Used for users, roles, customers, future entities.

## Error Handling
- Application layer: `Result<T>` (never throw for expected failures).
- API layer: Map to appropriate status (400 for validation, 404 for not found, 200/201 for success).
- Never leak stack traces or internals to clients.

## Logging
- Default ASP.NET Core logging (Information / Warning).
- No structured logging or correlation IDs yet.
- Future: Add for audit, auth events, service calls.

## Validation Rules (Current)
- Customer: FirstName + LastName required. Email and phone optional but unique when provided.
- Auth: Non-empty username/password. Active user only. Password hash verified.

## Linting / Formatting
- Backend: .NET analyzers + nullable.
- Frontend: Oxlint (hooks rules, only-export-components).
- Run lint/build before considering changes complete.

Last updated: 2026-07-07
