# Phase 0 Research: MVP RSS Reader — Subscription Management

**Feature**: `001-rss-subscriptions-mvp` | **Date**: 2026-06-10

The Technical Context contains no `NEEDS CLARIFICATION` items; the stakeholder
documents and constitution fully constrain the MVP. The decisions below confirm the
chosen approach and record the alternatives that were rejected.

## Decision 1: Single Express process serving API + static frontend

- **Decision**: Use one Node.js + Express application that registers `/api/` routes and
  also serves `public/` via `express.static`. JSON bodies parsed with `express.json()`.
- **Rationale**: Constitution Principle II and the tech stack mandate a single origin to
  eliminate CORS, port coordination, and API base URL configuration. One `package.json`
  and `npm start` is the entire setup.
- **Alternatives considered**:
  - Separate frontend dev server (Vite/Live Server): rejected — reintroduces CORS and
    port coordination; violates Principle II.
  - Static-only (no server): rejected — cannot expose the `POST`/`GET` API needed by the
    user stories.

## Decision 2: In-memory storage (JavaScript array)

- **Decision**: Store subscriptions in a module-level array in `server.js`. Data is lost
  when the process stops.
- **Rationale**: The MVP explicitly defers persistence (ProjectGoals, AppFeatures,
  constitution Principle I). An array is the simplest correct mechanism and keeps the
  dependency set to `express` only.
- **Alternatives considered**:
  - `better-sqlite3` / file storage: rejected for MVP — adds a dependency and complexity
    that belong to a later phase per Principle I.

## Decision 3: Vanilla HTML + JS frontend, no build step

- **Decision**: Plain `index.html`, `app.js`, and `styles.css` in `public/`. The frontend
  calls the API with the browser `fetch` API using relative URLs.
- **Rationale**: A frontend framework or bundler is explicitly prohibited (Principle I and
  tech stack "common pitfalls"). Relative URLs are required by Principle II.
- **Alternatives considered**:
  - React/Vue + bundler: rejected — adds a build step and dependencies forbidden for the MVP.

## Decision 4: Input validation at the API boundary

- **Decision**: The `POST /api/subscriptions` handler rejects requests whose `url` is
  missing, not a string, or empty/whitespace-only, returning `400`. It does **not** verify
  the URL points to a reachable or valid feed.
- **Rationale**: Constitution Principle III requires treating request bodies as hostile and
  validating at boundaries; FR-006 forbids adding empty values. FR-007 confirms feed
  reachability is out of scope for the MVP.
- **Alternatives considered**:
  - No validation: rejected — violates Principle III and FR-006.
  - Full URL/feed validation: rejected — out of MVP scope (FR-007), deferred to later phase.

## Decision 5: Route ordering and port configuration

- **Decision**: Register `express.json()`, then `/api/` routes, then `express.static('public')`.
  Read the port as `process.env.PORT || 3000`.
- **Rationale**: API routes must be defined before any static/catch-all handler so API calls
  return JSON rather than HTML (tech stack pitfalls). Port handling is mandated by Principle II.
- **Alternatives considered**:
  - Static before API: rejected — risks API paths resolving to the HTML page.
  - Hardcoded port: rejected — violates Principle II.

## Decision 6: No tests in the MVP

- **Decision**: No automated tests for the MVP; verify with the local development checklist
  (curl + browser console).
- **Rationale**: Tests are optional and deferred to Extended-MVP (`vitest`/`supertest`) per
  constitution Principle V and the spec (tests not requested).
- **Alternatives considered**:
  - Add `vitest`/`supertest` now: rejected — premature for the MVP scope per Principle I.

## Summary

All Technical Context items are resolved with no open clarifications. The plan proceeds to
Phase 1 design with the single-process, in-memory, vanilla-frontend approach.
