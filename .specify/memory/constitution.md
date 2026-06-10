<!--
SYNC IMPACT REPORT
Version change: (template / unversioned) → 1.0.0
Bump rationale: Initial ratification of a concrete constitution from the project
  template; all placeholder tokens replaced with project-specific principles.

Modified principles:
  [PRINCIPLE_1_NAME] → I. MVP-First Simplicity (YAGNI)
  [PRINCIPLE_2_NAME] → II. Single-Origin Architecture Integrity
  [PRINCIPLE_3_NAME] → III. Security by Default (NON-NEGOTIABLE)
  [PRINCIPLE_4_NAME] → IV. Maintainable & Readable Code
  [PRINCIPLE_5_NAME] → V. Verifiable Code Quality

Added sections:
  - Technology & Security Constraints (was [SECTION_2_NAME])
  - Development Workflow & Quality Gates (was [SECTION_3_NAME])

Removed sections: none

Templates requiring updates:
  ✅ .specify/templates/plan-template.md — Constitution Check gate aligns with
     principles (no hardcoded rules to change; gate references this file).
  ✅ .specify/templates/spec-template.md — mandatory sections compatible; no
     constitution-driven changes required.
  ✅ .specify/templates/tasks-template.md — task categories (setup, foundational,
     per-story, validation) are compatible with the principles; tests remain
     optional per Principle V phasing.

Follow-up TODOs: none
-->

# RSS Feed Reader Constitution

## Core Principles

### I. MVP-First Simplicity (YAGNI)

Every change MUST deliver the smallest increment that satisfies the current phase
and nothing more. The MVP scope is strictly: add a subscription by URL and display
the subscription list, using in-memory storage and the single `express` dependency.

- Features beyond the active phase (feed fetching, persistence, polling, removal,
  read/unread, validation) MUST NOT be implemented until that phase is reached.
- No frontend framework, bundler, transpiler, or build step is permitted; the
  frontend MUST remain static HTML + vanilla JavaScript.
- New dependencies MUST be justified against the active phase before being added.

Rationale: The project is a proof-of-concept whose value is speed and clarity;
unrequested complexity directly contradicts the stakeholder goals and slows delivery.

### II. Single-Origin Architecture Integrity

The application MUST remain one Node.js + Express process that serves both the REST
API and the static frontend from the same origin and port.

- The frontend MUST call the API using relative paths (e.g., `fetch('/api/subscriptions')`);
  hardcoded `http://localhost` URLs are prohibited.
- All API routes MUST live under the `/api/` prefix and MUST be registered before any
  static catch-all or 404 handler.
- No separate frontend dev server, CORS configuration, or API base URL config may be
  introduced.
- The listening port MUST be read as `process.env.PORT || 3000`.

Rationale: A single origin eliminates CORS, port coordination, and configuration drift,
which is the core architectural promise of the chosen stack.

### III. Security by Default (NON-NEGOTIABLE)

Security MUST be considered at every system boundary, even in the POC.

- All untrusted input (request bodies, query parameters, feed-derived data) MUST be
  treated as hostile; data crossing a boundary MUST be validated and/or escaped.
- Secrets MUST NOT be hardcoded; configuration MUST come from environment variables.
- `node_modules/` MUST be git-ignored and MUST NOT be committed.
- Any feature that renders feed content in the browser MUST sanitize HTML (e.g.,
  `sanitize-html`) before display; raw feed HTML MUST NOT be injected into the DOM.
- Code MUST avoid the OWASP Top 10 classes of vulnerability (notably injection and XSS)
  applicable to this stack; identified issues MUST be fixed before merge.

Rationale: The architecture is explicitly intended to grow into production-ready
features; insecure shortcuts taken in the POC become exploitable defects later.

### IV. Maintainable & Readable Code

Code MUST be organized for clarity and future extension without rewrites.

- The project structure MUST follow the agreed flat layout: `server.js`, `package.json`,
  `public/` (`index.html`, `app.js`, `styles.css`), and `.gitignore`.
- Functions and modules MUST have a single, clear responsibility; API, storage, and
  view concerns MUST stay separated.
- Naming MUST be descriptive; comments are added only where intent is non-obvious.
- Changes MUST NOT introduce dead code, speculative abstractions, or one-off helpers.

Rationale: Maintainability is a stated stakeholder priority and the precondition for
the documented incremental roadmap (Extended-MVP and beyond).

### V. Verifiable Code Quality

Every increment MUST be demonstrably correct against the phase's acceptance criteria.

- For the MVP, completion MUST be verified end-to-end: `npm install` and `npm start`
  succeed, `GET /api/subscriptions` returns a JSON array, and adding a URL updates the
  displayed list with no browser console errors.
- The application MUST start cleanly with no unhandled errors or warnings introduced by
  the change.
- When tests are introduced (Extended-MVP and later), they MUST use `vitest`/`supertest`
  and cover the API contract and primary user journeys.
- Code MUST be free of obvious correctness defects (unhandled promise rejections, unguarded
  input) before it is considered done.

Rationale: Quality is a stated priority; objective, repeatable verification prevents
regressions as the application grows incrementally.

## Technology & Security Constraints

- **Runtime**: Node.js 20 LTS or later; no global packages, compilers, or build tooling.
- **MVP dependencies**: `express` only. In-memory storage (a JavaScript array). No HTTP
  client or parsing libraries.
- **Extended-MVP dependencies**: add `rss-parser` for fetching and parsing; manual refresh
  only, no background polling.
- **Future-phase dependencies** (only when their phase is reached): `better-sqlite3`
  (persistence), `node-cron` (scheduled refresh), `sanitize-html` (safe rendering),
  `vitest`/`supertest` (testing).
- **Cross-platform**: code MUST run identically on Windows, macOS, and Linux.
- **Server wiring**: `server.js` MUST call `express.json()` and `express.static('public')`;
  `package.json` MUST define `"start": "node server.js"`.

## Development Workflow & Quality Gates

- **Phase discipline**: Work proceeds MVP → Extended-MVP → Future. A later-phase change
  MUST NOT land while an earlier phase is incomplete unless explicitly approved.
- **Pre-merge gate**: Before a change is accepted, the relevant local development checklist
  MUST pass and Principles I–V MUST be satisfied.
- **Security review**: Any change touching input handling, feed data, or rendering MUST be
  reviewed against Principle III.
- **Version control hygiene**: `.gitignore` MUST exclude `node_modules/` before the first
  commit; secrets MUST never be committed.

## Governance

This constitution supersedes other practices for this repository. When guidance conflicts,
the constitution wins.

- **Amendments**: Changes to this document MUST be proposed with rationale, an updated
  version number, and a sync check of dependent templates (`plan-template.md`,
  `spec-template.md`, `tasks-template.md`).
- **Versioning policy**: Semantic versioning applies — MAJOR for incompatible governance or
  principle removal/redefinition, MINOR for added or materially expanded principles/sections,
  PATCH for clarifications and non-semantic refinements.
- **Compliance review**: All plans, specs, and task lists MUST verify alignment with these
  principles. Any deviation MUST be justified in the plan's Complexity Tracking section or
  rejected.

**Version**: 1.0.0 | **Ratified**: 2026-06-10 | **Last Amended**: 2026-06-10
