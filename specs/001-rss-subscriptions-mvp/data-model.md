# Phase 1 Data Model: MVP RSS Reader — Subscription Management

**Feature**: `001-rss-subscriptions-mvp` | **Date**: 2026-06-10

The MVP has a single conceptual entity held in memory for the current session.

## Entity: Subscription

Represents a single feed the user has added.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `url` | string | Yes | The feed URL exactly as provided by the user. Non-empty, non-whitespace. |

### Notes

- The MVP captures **only** the URL. No title, description, timestamps, or generated id
  are stored (consistent with spec Assumptions and constitution Principle I).
- A `Subscription` exists only in memory for the duration of the running process. It has
  no persisted identity.

### Validation Rules

Applied at the API boundary (constitution Principle III, FR-006):

- `url` MUST be present in the request body.
- `url` MUST be a string.
- `url` MUST NOT be empty or whitespace-only (trimmed length > 0).
- The MVP does **not** validate that `url` is a syntactically valid URL or a reachable/
  parseable RSS/Atom feed (FR-007).
- The MVP does **not** de-duplicate; the same URL may appear more than once (Edge Cases).

## Collection: Subscription List

The ordered collection of `Subscription` entries added during the current session.

- Backed by a module-level JavaScript array in `server.js`.
- New subscriptions are appended; existing entries are preserved (FR-008).
- Order reflects insertion order.
- Empty on process start (FR-005).

## State & Lifecycle

```text
[process start] → list = []        # empty (FR-005)
add(url) [valid] → list = [...list, { url }]   # append (FR-001, FR-008)
add(url) [empty/whitespace] → list unchanged    # rejected (FR-006)
[process stop] → list discarded     # in-memory only (Assumptions)
```

## Mapping to Requirements

| Requirement | Data model element |
|-------------|--------------------|
| FR-001 add by URL | append `{ url }` to Subscription List |
| FR-002 session storage | in-memory array lifetime |
| FR-003 display list | read Subscription List |
| FR-004 immediate update | list reflects append synchronously |
| FR-005 empty on first use | array initialized to `[]` |
| FR-006 reject empty | validation rule on `url` |
| FR-007 accept arbitrary URL | no URL/feed validation |
| FR-008 preserve existing | append-only mutation |
