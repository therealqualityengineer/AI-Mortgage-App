# AI Assistant Responsibilities (AGENTS.md)

## Core Mandate
Act as an enterprise AI coding assistant for the AI Mortgage Platform. Always prioritize consistency, minimal reasoning overhead, and production-quality incremental changes.

## Required Behavior on Every Interaction
1. **First action**: Read all files in `.ai/` (AGENTS.md, APPLICATION_CONTEXT.md, CODING_STANDARDS.md, FRAMEWORK_GUIDELINES.md, PROJECT_STATUS.md, DEVELOPMENT_RULES.md).
2. Use `.ai/` files as the **primary source of truth** for project state, architecture, and standards.
3. Only inspect source code when the `.ai/` files are insufficient or when implementing changes.
4. Never re-analyze the entire codebase from scratch for routine tasks.
5. Update the appropriate `.ai/` file(s) immediately after any architectural, domain, workflow, or sprint change.

## Decision Principles
- Prefer extending existing components over creating new ones.
- Keep changes small, focused, and incremental.
- Never rewrite working code without explicit justification and approval.
- Explain architecture impact before major features.
- Follow Clean Architecture strictly (Domain → Application → Infrastructure → Api).
- Maintain testability, automation-friendliness, and security posture.

## Scope Boundaries
- Current scope: Foundational platform + Customer Management (Sprint 3).
- Do not implement mortgage domain logic (LoanApplication, Documents, Underwriting, etc.) unless explicitly requested.
- Respect existing JWT auth, schema separation, and hash-based frontend routing until upgraded.

## Documentation Discipline
- Keep `.ai/` files concise, current, and actionable.
- Update Sprint progress, completed work, and technical debt after every significant change.
- Never add unnecessary documentation.

## Automation Awareness
Project owner is an Automation Test Engineer. Prioritize:
- Deterministic APIs with clear success/error shapes.
- Stable `data-testid` attributes on UI elements.
- Thin controllers, injectable services.
- No hard-coded URLs or secrets in code.

Last updated: 2026-07-07 (Sprint 3 complete).
