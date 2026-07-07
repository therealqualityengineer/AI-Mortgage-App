# FRAMEWORK_GUIDELINES.md

## Why Clean Architecture
- Enforces separation of concerns and testability.
- Domain is pure and stable; business rules do not depend on frameworks, DB, or UI.
- Enables independent evolution of layers and future AI orchestration.

## Layer Responsibilities
- **Domain**: Entities, value objects, domain events. Zero dependencies. (Currently: BaseEntity, Customer).
- **Application**: Use cases, DTOs, interfaces (repos/services), orchestration, `Result<T>`. Depends on Domain only.
- **Infrastructure**: EF Core mappings, repositories, migrations, seeding, external integrations. Depends on Domain + Application (for interfaces).
- **Api**: Controllers, DI wiring, auth config, minimal endpoints. Depends on Application + Infrastructure. Thin layer.

Dependency rule (strict): Inner layers know nothing of outer. Api depends inward only.

## Project Structure
```
backend/
  AI.Mortgage.Domain/           # Entities, Common
  AI.Mortgage.Application/      # Services, Repos (interfaces + impl), DTOs, Common
  AI.Mortgage.Infrastructure/   # DbContext, Persistence Entities, Migrations, SeedData
  AI.Mortgage.Api/              # Controllers, Program.cs, config
  tests/
frontend/
  src/pages/                    # Route-level components
  src/shared/components/        # Reusable UI
  src/types/                    # Shared TS types (Route)
  src/config.ts                 # Single source for API URL
```

## Authentication Strategy
- JWT (symmetric key) issued on login.
- Stateless. Token stored in localStorage (frontend).
- Backend validates via JwtBearer + [Authorize].
- Passwords: ASP.NET Core Identity PasswordHasher (PBKDF2 + per-user salt).
- Seeded single Admin user on first run (idempotent).

## Database Strategy
- PostgreSQL + EF Core 8 + Npgsql.
- Schema separation: identity.*, customer.*, public.
- UUID primary keys (Guid).
- Snake_case columns, audit fields everywhere.
- Migrations as source of truth. Idempotent seeding.

## Future Scalability
- Add domain modules under Domain/Entities (LoanApplication, Document, Decision, etc.).
- Feature slices in frontend `src/features/`.
- Replace hash routing with React Router when stable.
- Add validation libraries, global error middleware, structured logging.
- Docker Compose for local stack. Multi-tenant later.

## Testing Strategy
- Backend: xUnit. Focus on Application services + controllers (thin).
- Prefer unit tests for business rules; integration for EF paths.
- Frontend: Minimal today. Plan Playwright for E2E (login, customer flows).
- All endpoints must return deterministic JSON shapes for contract testing.

Last updated: 2026-07-07
