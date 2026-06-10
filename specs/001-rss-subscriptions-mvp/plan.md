# Implementation Plan: MVP RSS Reader — Subscription Management

**Branch**: `001-rss-subscriptions-mvp` | **Date**: 2026-06-10 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `specs/001-rss-subscriptions-mvp/spec.md`

## Summary

Deliver the MVP capability: a single user can add an RSS/Atom feed subscription by URL
and see the subscription list update immediately. The implementation is one Node.js +
Express application that exposes a minimal REST API (`GET`/`POST /api/subscriptions`)
and serves a static HTML + vanilla JavaScript frontend from the same origin. Storage is
an in-memory array; no feed fetching, parsing, persistence, validation, or removal is in
scope. The architecture is kept intentionally minimal while remaining extensible for
later phases (Extended-MVP, persistence, polling).

## Technical Context

**Language/Version**: JavaScript on Node.js 20 LTS or later (no transpilation)

**Primary Dependencies**: `express` only (MVP). No HTTP client, parser, or build tooling.

**Storage**: In-memory JavaScript array, scoped to the running process/session. No database.

**Testing**: None for the MVP (tests are optional per constitution Principle V and are
deferred to Extended-MVP using `vitest`/`supertest`). Verification is manual via the
local development checklist (curl + browser).

**Target Platform**: Local single-process server on Windows, macOS, or Linux; UI runs in
a modern browser at `http://localhost:3000`.

**Project Type**: Single-process web application (combined API + static frontend, one origin).

**Performance Goals**: Subscription list reflects a newly added entry within 1 second
(SC-003); trivial in-memory operation, no scaling concerns for the MVP.

**Constraints**: Single origin, single port (`process.env.PORT || 3000`); no CORS; no
build step; no frontend framework; relative-path `fetch` only; `node_modules/` git-ignored.

**Scale/Scope**: Single local user; a handful of subscriptions held in memory for one
session. Two API endpoints, one HTML page, one frontend script, one stylesheet.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Compliance |
|-----------|------------|
| I. MVP-First Simplicity (YAGNI) | PASS — only add + list; `express` only; in-memory; no build step, no framework. |
| II. Single-Origin Architecture Integrity | PASS — one Express process serves API + static; `/api/` prefix; relative `fetch`; `PORT` env with 3000 fallback; no CORS. |
| III. Security by Default (NON-NEGOTIABLE) | PASS — request body validated at the API boundary (reject empty/whitespace, type-check); no secrets; `node_modules/` git-ignored; no feed HTML rendered in MVP. |
| IV. Maintainable & Readable Code | PASS — agreed flat layout; API/storage/view concerns separated; descriptive naming; no speculative abstractions. |
| V. Verifiable Code Quality | PASS — end-to-end manual verification via the local checklist; clean start; tests deferred per phasing. |

**Result**: All gates pass. No violations; Complexity Tracking not required.

## Project Structure

### Documentation (this feature)

```text
specs/001-rss-subscriptions-mvp/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
│   └── subscriptions-api.md
├── checklists/
│   └── requirements.md  # Spec quality checklist (from /speckit.specify)
└── tasks.md             # Phase 2 output (/speckit.tasks — NOT created here)
```

### Source Code (repository root)

```text
RSSFeedReader (root)
├── server.js              # Express app: API routes (/api/subscriptions) + static serving
├── package.json           # express dependency + "start": "node server.js"
├── public/                # static frontend served by Express
│   ├── index.html         # subscription management UI (input + add button + list)
│   ├── app.js             # frontend logic using fetch with relative URLs
│   └── styles.css         # basic styling
└── .gitignore             # must include node_modules/
```

**Structure Decision**: Single-process web application using the flat layout mandated by
the tech stack and constitution (Principle IV). The API and the static frontend are served
by the same `server.js` on one port. No `src/`, `backend/`, or `frontend/` split is used,
since a separate frontend server would reintroduce CORS and port coordination, violating
Principle II.

## Complexity Tracking

> No constitution violations. This section is intentionally empty.
