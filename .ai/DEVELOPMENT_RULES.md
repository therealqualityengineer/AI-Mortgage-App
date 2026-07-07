# DEVELOPMENT_RULES.md

## Core Rules
1. **Never rewrite working code** unnecessarily. Extend or compose instead.
2. **Prefer incremental changes**. One focused change per commit/task.
3. **Analyze before modifying**. Read `.ai/` files first. Inspect code only when needed.
4. **Preserve Clean Architecture** at all times:
   - Domain: zero dependencies.
   - Application depends only on Domain (and interfaces it defines).
   - Infrastructure implements Application contracts.
   - Api is thin orchestration + wiring.
5. **Keep controllers thin**. Business logic lives in Application services.
6. **Use Result<T>** for all application operations. Map to HTTP at boundary only.
7. **No hard-coded secrets or URLs**. Use config + environment.
8. **Idempotent seeding and migrations**. Safe to re-run.
9. **Automation friendly**:
   - Deterministic API responses.
   - Stable data-testid on UI.
   - Constructor injection everywhere.
10. **Update context**. After any architecture, schema, workflow, or sprint change, update the relevant `.ai/*.md` file.

## When Adding New Features
- Start with Domain (if new entity/aggregate).
- Define interfaces in Application first.
- Implement in Infrastructure.
- Wire in Api (minimal controller).
- Add or extend frontend only after backend contract is stable.
- Always explain architecture impact before large features.

## Code Quality Gates
- Backend + frontend lint + build must pass.
- No new compiler warnings.
- Security: never log secrets, never commit real credentials.
- Validation: enforce at Application layer before persistence.

## Anti-Patterns to Avoid
- Fat controllers.
- Business logic in UI or persistence.
- Direct DbContext usage from Api or pages.
- Magic strings for routes or roles.
- Duplicated auth or config logic.

## Documentation
- `.ai/` is the single source of truth for AI context.
- Update it immediately on change. Keep concise.

Last updated: 2026-07-07
