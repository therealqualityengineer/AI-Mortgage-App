# PROJECT_STATUS.md

## Current Sprint
Sprint 3.1 – Asynchronous Welcome Email using Hangfire (COMPLETE as of 2026-07-07).

## Completed Work
- Layered .NET 8 solution with Clean Architecture.
- PostgreSQL + EF Core configured with schema-separated tables.
- Identity schema (`identity.users`, `identity.roles`, `identity.user_roles`) + audit fields + UUID PKs.
- JWT authentication + `IAuthService` in Application layer + PasswordHasher.
- Seeded Admin user (`arunqa`) idempotently.
- Customer domain entity + repository + service + DTOs + validation.
- Full CustomersController (protected): list, get, create, update, status toggle.
- Frontend: hash routing for /customers/*, reusable CustomerForm, list/view/add/edit pages.
- Dashboard quick actions and nav updated for Customers.
- All protected calls use Bearer token.
- Backend + frontend build + lint clean.
- Ports: Backend 5294, Frontend 5173.
- **Sprint 3.1 - Asynchronous Welcome Email using Hangfire**:
  - Hangfire.AspNetCore + Hangfire.PostgreSql added; PostgreSQL job storage.
  - `IEmailService` (Application/Email) + `EmailService` (Infrastructure/Email) using Mailtrap SMTP.
  - `IEmailQueue` + `HangfireEmailQueue` (fire-and-forget enqueue).
  - `EmailJob` with `[AutomaticRetry(Attempts = 3)]`.
  - `EmailOptions` bound from `Email:Smtp`.
  - Protected `/hangfire` dashboard via `HangfireAuthorizationFilter` (Admin role only).
  - CustomerService.CreateAsync queues welcome email after DB save (non-blocking).
  - Failures retried by Hangfire; customer creation unaffected.

## Current Task
None active. Platform ready for next mortgage domain module.

## Next Recommended Task
Begin Loan Application module (or next approved domain aggregate). Follow Clean Architecture: start with Domain entity, then Application interfaces/DTOs/service, Infrastructure repo, Api controller, then minimal frontend page.

## Technical Debt
- Hash routing (fragile for automation) – plan React Router.
- No input validation libraries (FluentValidation or similar).
- No global exception middleware or problem-details.
- Minimal tests (only basic AuthServiceTests).
- Inline styles + no design system yet.
- Connection string in appsettings.json (dev only).
- No CORS for production origins.
- No structured logging or correlation.
- Customer does not yet inherit BaseEntity (minor).

## Pending Decisions
- Next domain module priority (LoanApplication vs Document vs other).
- Frontend routing upgrade timing.
- Validation framework choice.
- Test coverage targets before domain work.

Last updated: 2026-07-07
