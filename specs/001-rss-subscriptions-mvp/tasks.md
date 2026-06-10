---
description: "Task list for MVP RSS Reader — Subscription Management"
---

# Tasks: MVP RSS Reader — Subscription Management

**Input**: Design documents from `/specs/001-rss-subscriptions-mvp/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: NOT included. The MVP defers automated tests to Extended-MVP per constitution Principle V and plan.md ("Testing: None for the MVP"). Verification is manual via quickstart.md (curl + browser).

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2)
- Include exact file paths in descriptions

## Path Conventions

Flat single-process layout at repository root (per plan.md "Structure Decision"):

- `server.js` — Express app: API routes + static serving + in-memory store
- `package.json` — `express` dependency + `start` script
- `public/index.html`, `public/app.js`, `public/styles.css` — static frontend
- `.gitignore` — must include `node_modules/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and dependency setup

- [ ] T001 Create `package.json` at repository root with `"type": "commonjs"`, `"start": "node server.js"` script, and Node.js 20+ engine field per plan.md Technical Context
- [ ] T002 [P] Create `.gitignore` at repository root containing `node_modules/` (constitution Principle III; plan.md Constraints)
- [ ] T003 Add and install the `express` dependency by running `npm install express` from the repository root (only dependency per plan.md "Primary Dependencies")

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Express server bootstrap, JSON parsing, static serving, and the in-memory store that ALL user stories depend on

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T004 Create `server.js` at repository root with an Express app that registers `express.json()`, reads the port via `process.env.PORT || 3000`, and starts listening (research.md Decision 5; plan.md Constraints)
- [ ] T005 In `server.js`, declare the module-level in-memory `subscriptions` array initialized to `[]` (data-model.md "Collection: Subscription List"; FR-002, FR-005)
- [ ] T006 In `server.js`, register `express.static('public')` AFTER the `/api/` routes are mounted so API paths resolve to JSON, not the HTML page (research.md Decision 5; constitution Principle II)
- [ ] T007 [P] Create the static shell `public/index.html` with a single page that links `styles.css` and loads `app.js`, served from the same origin (plan.md Project Structure; constitution Principle II)
- [ ] T008 [P] Create `public/styles.css` with basic styling for the input, add button, and subscription list (plan.md Project Structure)
- [ ] T009 [P] Create `public/app.js` with an entry point that runs on `DOMContentLoaded` and uses `fetch` with relative URLs only (constitution Principle II; research.md Decision 3)

**Checkpoint**: Server starts cleanly on `http://localhost:3000`, serves `public/`, and holds an empty in-memory list — user story implementation can now begin

---

## Phase 3: User Story 1 - Add a feed subscription by URL (Priority: P1) 🎯 MVP

**Goal**: A user can submit an RSS/Atom feed URL and have it appended to the session's subscription list, with empty/whitespace input rejected at the API boundary.

**Independent Test**: `POST /api/subscriptions` with `{"url": "..."}` returns `201` and the URL is appended; posting `{"url": "   "}` returns `400` and the list is unchanged. In the UI, entering a URL and clicking Add submits it and clears the input for the next entry.

### Implementation for User Story 1

- [ ] T010 [US1] Implement `POST /api/subscriptions` in `server.js`: append `{ url }` to the in-memory array and respond `201` with the created subscription (contracts/subscriptions-api.md POST; FR-001, FR-008)
- [ ] T011 [US1] Add boundary validation to the `POST /api/subscriptions` handler in `server.js`: reject when `url` is missing, not a string, or empty/whitespace-only (trimmed length 0) with `400 { "error": "url is required" }` (data-model.md Validation Rules; FR-006; constitution Principle III)
- [ ] T012 [P] [US1] Add the add-subscription UI to `public/index.html`: a text input for the URL and an Add button/form (FR-001)
- [ ] T013 [US1] Implement the add action in `public/app.js`: on Add, `POST` the trimmed URL via relative `fetch`, then clear/ready the input for the next URL (FR-001, FR-003 of acceptance scenario 3; constitution Principle II)

**Checkpoint**: User Story 1 is functional — subscriptions can be added via API and UI, and invalid input is rejected

---

## Phase 4: User Story 2 - View the current list of subscriptions (Priority: P1)

**Goal**: A user sees the current subscription list on load (empty on first run) and the displayed list updates immediately after a subscription is added.

**Independent Test**: `GET /api/subscriptions` returns `[]` on first run and returns all added URLs in insertion order. In the UI, loading the app shows the current list, and adding a subscription updates the displayed list within 1 second without removing existing entries.

### Implementation for User Story 2

- [ ] T014 [US2] Implement `GET /api/subscriptions` in `server.js`: return the in-memory array as a JSON array in insertion order, `[]` when empty (contracts/subscriptions-api.md GET; FR-003, FR-005)
- [ ] T015 [P] [US2] Add the list container element to `public/index.html` for rendering subscriptions (FR-003, FR-005)
- [ ] T016 [US2] Implement `loadSubscriptions()` render logic in `public/app.js`: `GET` the list via relative `fetch` on load and render each URL into the list container, showing an empty list when none exist (FR-003, FR-005, SC-004)
- [ ] T017 [US2] In `public/app.js`, re-render the list immediately after a successful add so the new entry appears alongside existing ones (FR-004, FR-008, SC-002, SC-003)

**Checkpoint**: User Stories 1 AND 2 both work — the list is visible on load and updates immediately after each add

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Final verification and cleanup across both stories

- [ ] T018 Run the API verification steps in `specs/001-rss-subscriptions-mvp/quickstart.md` (curl: empty list, add, list again, reject empty) and confirm responses match the contract
- [ ] T019 Run the UI verification steps in `specs/001-rss-subscriptions-mvp/quickstart.md` in a browser, including DevTools Console with no errors on load or add (constitution Principle V; SC-001, SC-005)
- [ ] T020 [P] Review `server.js` and `public/` for descriptive naming, separated API/storage/view concerns, and no speculative abstractions (constitution Principle I & IV)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — start immediately
- **Foundational (Phase 2)**: Depends on Setup — BLOCKS both user stories
- **User Story 1 (Phase 3)**: Depends on Foundational
- **User Story 2 (Phase 4)**: Depends on Foundational; independently testable from US1 (separate endpoints/elements), though US1's UI add is most observable once US2's render exists
- **Polish (Phase 5)**: Depends on the user stories being delivered

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational — no dependency on US2 for its API path
- **User Story 2 (P1)**: Can start after Foundational — no dependency on US1 for its API path

### Within Each User Story

- API endpoint before/independent of frontend wiring
- Validation belongs with the endpoint it guards (US1: T010 before/with T011)
- Render before immediate-update wiring (US2: T016 before T017)

### Parallel Opportunities

- Setup: T002 can run parallel to T001
- Foundational: T007, T008, T009 (separate files) can run in parallel after T004–T006
- US1: T012 (`index.html`) can run parallel to the server work (T010–T011)
- US2: T015 (`index.html`) can run parallel to the server work (T014)
- Both P1 stories can be staffed in parallel after Phase 2 (server endpoints are different routes; UI tasks touch shared files and should be coordinated)

---

## Parallel Example: Foundational Phase

```bash
# After server.js bootstrap (T004–T006), create the static files together:
Task: "Create public/index.html shell linking styles.css and app.js"
Task: "Create public/styles.css with basic styling"
Task: "Create public/app.js entry point using relative fetch"
```

## Parallel Example: User Story 1

```bash
# Server-side and the index.html markup can proceed in parallel:
Task: "Add input + Add button to public/index.html"   # T012 [P]
Task: "Implement POST /api/subscriptions in server.js" # T010 (then T011 validation)
```

---

## Implementation Strategy

### MVP First (User Story 1)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL — blocks both stories)
3. Complete Phase 3: User Story 1 (add subscription, with validation)
4. **STOP and VALIDATE**: POST a URL and confirm `201`; POST whitespace and confirm `400`
5. Note: the add becomes visually observable once User Story 2's render (Phase 4) is in place — both P1 stories together form the demonstrable MVP per spec.md

### Incremental Delivery

1. Setup + Foundational → server runs, serves static, holds empty list
2. Add User Story 1 → verify add + validation via API/UI
3. Add User Story 2 → verify list display + immediate update → demo the full MVP
4. Polish → run quickstart.md end-to-end

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to a specific user story (US1, US2) for traceability
- Both user stories are P1 and together define the viable MVP ("add a subscription AND display the list")
- No automated tests in the MVP — verify via quickstart.md
- In-memory storage only; restarting the server clears the list (expected MVP behavior)
- Commit after each task or logical group
