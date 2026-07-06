# AI Mortgage Platform

## 1. Project Overview
- **Project purpose**: Enterprise-grade AI-powered mortgage platform for loan origination, underwriting, document processing, and decision automation.
- **Business domain**: Mortgage lending / financial services. Handles applicant data, loan products, credit, income verification, document AI extraction, risk scoring, and compliance workflows.
- **Current project scope**: Foundational platform setup only. Includes .NET 8 backend skeleton with Clean Architecture layers, PostgreSQL + EF Core, basic authentication stub, health/audit endpoints, and a minimal React + TypeScript + Vite frontend shell with login/dashboard navigation. No mortgage business logic exists yet.
- **Long-term vision**: End-to-end AI-orchestrated mortgage lifecycle platform with automated document intelligence, risk models, applicant portal, underwriter workbench, and regulatory reporting.

## 2. Technology Stack
- **Frontend**: React 19, TypeScript, Vite, Oxlint (linting)
- **Backend**: .NET 8 (C#), ASP.NET Core Web API
- **Database**: PostgreSQL (connection via Npgsql)
- **ORM**: Entity Framework Core 8
- **Development tools**: Visual Studio / VS Code, dotnet CLI, npm, Vite
- **Testing tools**: xUnit (backend), minimal frontend tests (none yet)

## 3. Architecture
Current architecture follows a layered Clean Architecture approach with strict dependency direction (Api → Application → Infrastructure → Domain). The implementation is early-stage and incomplete.

Layers and responsibilities:
- **Domain**: Core business entities, value objects, and domain events. Currently contains only `BaseEntity` and placeholder `AuditLogEntry`. No mortgage aggregates yet.
- **Application**: Use-case services, DTOs, business rules orchestration, and cross-cutting abstractions (e.g., `Result<T>`). Services currently live here (AuthService stub, PasswordVerifier, HealthCheckService) but are also duplicated in the Api layer.
- **Infrastructure**: Persistence (EF Core `ApplicationDbContext`), entity mappings, migrations, external integrations. Identity tables mapped to `identity` schema; audit table in public schema.
- **Api**: Controllers, minimal services (AuthService implementation), configuration, Swagger. Entry point (`Program.cs`).

Simple text architecture diagram:

```
Frontend (React/Vite)
        │  (fetch)
        ▼
API Layer (Controllers, minimal services)
        │
        ▼
Application Layer (Services, Result<T>, future use cases)
        │
        ▼
Infrastructure (EF Core, DbContext, Entities, Migrations)
        │
        ▼
PostgreSQL (identity.* + public AuditEntries)
```

## 4. Repository Structure
- `AI-Mortgage-App.sln` — Visual Studio solution file.
- `backend/`
  - `AI.Mortgage.Domain/` — Pure domain models (entities, common base).
  - `AI.Mortgage.Application/` — Application services, common utilities (Result<T>).
  - `AI.Mortgage.Infrastructure/` — EF Core DbContext, persistence entities, migrations.
  - `AI.Mortgage.Api/` — ASP.NET Core API project (controllers, Program.cs, appsettings).
  - `tests/AI.Mortgage.Api.Tests/` — xUnit test project (currently minimal).
- `frontend/`
  - `src/pages/` — Route-level pages (LoginPage, DashboardPage).
  - `src/features/` — Planned feature modules (empty, contains README).
  - `src/shared/` — Planned shared UI/hooks/utilities (empty, contains README).
  - Standard Vite + React + TS setup (`main.tsx`, `App.tsx`, vite.config.ts).
- `docs/architecture/` — Architecture decision records and sprint notes (sprint1-setup.md).
- Root: No AGENTS.md or kilo config files present at time of initial creation.

## 5. Database
- **Engine**: PostgreSQL
- **Connection**: Configured via `ConnectionStrings:DefaultConnection` in `appsettings.json` / `appsettings.Development.json`.
- **ORM**: EF Core with Npgsql provider.
- **Existing tables** (from migrations + model):
  - `AuditEntries` (public schema) — columns: Id (uuid PK), EntityName, Action, UserId, CreatedAt, Details. (from InitialCreate)
  - Identity schema (from CreateIdentitySchema migration):
    - `identity.users` (uuid PK)
    - `identity.roles` (uuid PK)
    - `identity.user_roles` (composite PK on user_id + role_id)
- **Relationships**: `user_roles` is a join table with FKs to users and roles (Cascade delete). No navigation properties defined yet.
- **Migrations applied state**: `InitialCreate` (AuditEntries) + `CreateIdentitySchema` (identity schema + tables + indexes + constraints). No pending model changes.
- **Seeding**: Initial identity data seeded on startup via `SeedData.Initialize` (only if 'arunqa' user does not exist).
  - Role: `Admin` (identity.roles)
  - User: `arunqa` / FullName="System Administrator" / Email="therealqualityengineer@gmail.com" (password hashed with PasswordHasher<TUser>)
  - Assignment: `arunqa` linked to `Admin` role in `identity.user_roles`
- **Audit fields**: All identity tables include: created_at, updated_at, created_by, updated_by, is_active (plus standard PK/unique constraints).

## 6. API
**Implemented endpoints** (as of current state):
- `POST /api/auth/login` — Accepts `{ username, password }`. Returns `{ success, token, user }` on success (JWT). Uses clean `IAuthService` + `Result<T>` + PasswordHasher.
- `GET /api/auth/me` — Protected endpoint (`[Authorize]`). Returns current user from validated JWT claims.
- `GET /api/auth/schema?schemaName=...` — Introspection helper (debug / dev only).
- `GET /api/health` — Returns `{ status: "ready" }`.
- `GET /api/audit` — Returns `{ status: <health service value> }` (currently always "ready").
- `GET /health` (minimal API) — Returns `{ status: "ready" }`.
- Swagger UI enabled in Development (`/swagger`).

**Placeholders and planned**:
- No mortgage domain endpoints (loan applications, documents, decisions, etc.).
- No input validation or DTOs.
- No versioning strategy.
- No rate limiting or CORS policy yet.

## 7. Frontend
**Completed screens**:
- `LoginPage` (`/`) — Simple form (username/password). Hard-coded demo defaults. Posts to backend login. On success stores user + JWT token in localStorage and navigates to dashboard.
- `DashboardPage` (`/dashboard`) — Shows signed-in user + calls protected `/api/auth/me` using Authorization: Bearer token. Logout clears storage.

**Navigation**:
- Hash-based routing in `App.tsx` (`#/` and `#/dashboard`). No React Router yet.
- No protected route component; dashboard manually checks localStorage.

**Components**:
- No reusable component library.
- All UI uses inline styles.
- `features/` and `shared/` directories prepared but empty.

## 8. Business Modules
**Completed modules**: None. The platform is pre-domain.

**Planned modules** (inferred from project name and typical mortgage platforms):
- Authentication & Authorization (roles, permissions)
- Loan Application / Origination
- Document Upload & AI Extraction (OCR, entity extraction)
- Credit & Income Verification
- Underwriting Workbench & Decisioning
- Pricing & Product Engine
- Compliance & Audit Trail
- Reporting & Analytics
- Applicant Portal

## 9. Coding Standards
- **C#**: Nullable reference types enabled, implicit usings. Namespaces match folder structure. Minimal comments. PascalCase for public members. Services often static or simple classes.
- **Frontend**: Functional React components with TypeScript. No prop-types (using TS). Inline styles currently. Oxlint enforces React hooks rules and "only-export-components".
- **Architecture**: Clean Architecture followed for auth. `IAuthService` + `AuthService` live in Application layer. Api layer is thin (controllers only). JWT + PasswordHasher in place.
- **Testing**: xUnit for backend. Test classes in `AI.Mortgage.Api.Tests`. Very few tests exist.
- **Config**: Environment-specific `appsettings.*.json`. Connection strings contain real dev credentials in checked-in `appsettings.json` (security concern).

## 10. Current Sprint Status
- **Completed work**:
  - Solution and layered project structure created.
  - EF Core + PostgreSQL configured.
  - Initial migration for AuditEntries.
  - Identity schema migration (`CreateIdentitySchema`): `identity.users`, `identity.roles`, `identity.user_roles` with UUID PKs, full audit fields, unique indexes, FKs.
  - Clean login implementation: `IAuthService` + `AuthService` in Application layer using `Result<T>`, PasswordHasher, and EF Core. Controller thin. JWT token issued on login.
  - `GET /api/auth/me` protected endpoint using `[Authorize]` + Bearer JWT.
  - Frontend stores JWT in localStorage and sends it on protected calls.
  - Health and audit endpoints.
  - Minimal React shell with hash routing and login/dashboard.
  - Schema introspection endpoint.
  - Frontend API URL corrected to `http://localhost:5294` (matches backend launchSettings).
  - Verified runnable: backend (5294) + frontend Vite (5173) start successfully; login page loads, returns JWT, dashboard calls protected `/me` endpoint.
  - Initial identity data seeded on startup (`SeedData.Initialize`): Admin role + arunqa user (password hashed with PasswordHasher<TUser>) + role assignment. Idempotent (skips if user exists).
- **Work in progress**:
  - Nothing explicitly tracked.
- **Next tasks** (inferred):
  - Add proper frontend routing and shared components.
  - Begin first mortgage domain module (e.g., LoanApplication).

## 11. Technical Debt
- (Resolved) Duplicate AuthService removed. Login now uses clean Application-layer implementation (`IAuthService` + `Result<T>` in `AI.Mortgage.Application.Services`).
- (Resolved) Password hashing now uses ASP.NET Core Identity PasswordHasher<TUser> (PBKDF2 + HMAC-SHA256, per-user salt, work factor). Old SHA256 removed.
- Hard-coded backend URL in frontend (was `http://localhost:5300`; resolved to 5294).
- (Resolved) Identity tables were defined but unmigrated; now implemented via CreateIdentitySchema migration with proper UUID PKs + audit fields.
- No real authentication (no tokens, sessions, or secure storage).
- No input validation or DTOs.
- Connection strings with credentials committed.
- `Class1.cs` placeholder files in all layers.
- No CORS policy, no error handling middleware, no logging configuration beyond defaults.
- Inline styles; no component library or design system.
- Minimal or empty tests.
- Audit domain entity (`AuditLogEntry`) unused; persistence entity (`AuditEntry`) used directly.

## 12. AI Development Rules

Always:
- Analyze before modifying code.
- Preserve Clean Architecture (Domain has zero dependencies; Application depends only on Domain/Infrastructure as needed; Api depends on Application + Infrastructure).
- Explain design decisions in comments or PR descriptions when introducing new patterns.
- Build production-quality code (proper error handling, validation, security, tests).
- Do not rewrite existing modules without explicit approval.
- Keep AGENTS.md updated whenever the architecture changes (new layers, major modules, DB schema changes, auth strategy).

## 13. Automation Considerations
Since the project owner is an Automation Test Engineer, the following must be considered on every change:

- **Testability considerations**: Keep controllers thin. Extract business logic into Application services with clear inputs/outputs. Prefer constructor injection. Avoid static state and hard-coded dependencies.
- **API testing considerations**: All endpoints should be deterministic and return structured JSON. Prefer explicit status codes. Document request/response contracts (even if only in this file until OpenAPI matures).
- **UI automation considerations**: Current hash routing is fragile for automation. Plan to introduce proper client-side routing with stable data-testid attributes. Avoid inline styles for elements that need reliable selectors; prefer semantic markup.
- **Future Playwright integration points**:
  - Login flow (`username`, `password`, submit, assert redirect or dashboard content).
  - Protected route behavior (logout, unauthenticated access).
  - Future form submissions for loan applications, document uploads, decision screens.
  - API contract tests via Playwright request context against `/api/*` endpoints.
  - Visual regression targets once UI components stabilize.

## 14. Future Roadmap
- Sprint 2+: Identity schema migration + proper user seeding + JWT authentication + role-based authorization.
- Domain modeling for core mortgage entities (LoanApplication, Applicant, Product, Document, Decision).
- API layer hardening (validation, problem details, global exception handling, versioning).
- Frontend: real routing, shared component library, feature-sliced architecture in `features/`.
- AI integration: document intelligence service, risk scoring orchestration.
- Observability: structured logging, health checks with dependencies, audit trail service.
- Testing: expand xUnit coverage, contract tests, E2E Playwright suite.
- DevOps: Docker Compose for local stack, CI pipeline, environment-specific configs without secrets.
- Long-term: multi-tenant support, advanced workflow engine, regulatory reporting module.

---

**Note**: This AGENTS.md reflects the state after Sprint 1 setup verification (2026-07-06). Backend (5294) + frontend Vite (5173) confirmed runnable with corrected API URL; login page loads and can authenticate against the DB-backed endpoint. Update this file on every significant architectural, domain, or infrastructure change.
