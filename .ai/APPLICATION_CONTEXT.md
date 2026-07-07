# APPLICATION_CONTEXT.md

## Business Domain
Enterprise AI-powered mortgage lending platform. Core flows: loan origination, document intelligence, underwriting, decision automation, compliance, and reporting.

## Current Workflows Implemented
- **Authentication**: Username/password login → JWT issuance → Bearer token for protected calls. Seeded admin user.
- **Customer Management** (Sprint 3): Full CRUD (create, read, update, soft status toggle). No hard delete. Email/phone uniqueness checks. Redirect to list after create.

## Modules Completed
- Foundational platform (Sprints 1-2): Clean Architecture .NET 8 + PostgreSQL + EF Core + JWT auth + React shell.
- Identity & Auth: `identity.users`, `identity.roles`, `identity.user_roles`.
- Customer Management: `customer.customers` + end-to-end backend + frontend pages.

## Modules Pending
- Loan Application / Origination
- Document Upload & AI Extraction
- Credit & Income Verification
- Underwriting Workbench & Decisioning
- Product/Pricing Engine
- Compliance, Reporting, Applicant Portal

## Database Schemas
- `identity.*`: users, roles, user_roles (UUID PKs, audit fields, snake_case columns).
- `customer.*`: customers (UUID PK, full profile + audit + soft delete via IsActive).
- `public`: AuditEntries (for future audit trail).
- ORM: EF Core 8 + Npgsql. Migrations applied: InitialCreate, CreateIdentitySchema, CreateCustomerSchema + post tweaks.

## APIs (Implemented)
- `POST /api/auth/login` → {success, token, user}
- `GET /api/auth/me` (protected)
- `GET /api/health`, `/health`
- Customers (protected):
  - GET /api/customers
  - GET /api/customers/{id}
  - POST /api/customers
  - PUT /api/customers/{id}
  - PATCH /api/customers/{id}/status
- Swagger in Development.

## UI Pages (Hash Routing)
- `/` → LoginPage
- `/dashboard` → DashboardPage (KPI placeholders, quick actions)
- `/customers` → CustomersListPage (list + actions)
- `/customers/new` → AddCustomerPage
- `/customers/:id` → ViewCustomerPage
- `/customers/:id/edit` → EditCustomerPage
- Shared: CustomerForm, DashboardHeader, KpiCard, ActionButton. All use data-testid.

## Authentication Flow
1. LoginPage posts credentials.
2. Backend validates via IAuthService + PasswordVerifier → issues JWT.
3. Frontend stores token + user in localStorage.
4. All subsequent calls send `Authorization: Bearer <token>`.
5. Protected endpoints use [Authorize] + JwtBearer validation.

## Sprint Progress
- Sprint 1: Solution + layers + Postgres skeleton.
- Sprint 2: Identity schema + JWT auth + seeding + basic frontend.
- Sprint 3 (current complete): Customer module (domain → api → ui) + navigation.
- All lint/build pass. Backend: 5294, Frontend: 5173.

Last updated: 2026-07-07
