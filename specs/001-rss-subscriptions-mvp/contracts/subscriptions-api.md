# API Contract: Subscriptions (MVP)

**Feature**: `001-rss-subscriptions-mvp` | **Date**: 2026-06-10

Base path: same origin as the served UI (`http://localhost:3000` by default). All routes
are under the `/api/` prefix and registered before static file serving. Requests and
responses use `application/json`.

---

## GET /api/subscriptions

Return the current list of subscriptions for the session.

### Request

- Method: `GET`
- Path: `/api/subscriptions`
- Body: none

### Response

- `200 OK`
- Body: JSON array of subscription objects. Empty array `[]` when none exist.

```json
[
  { "url": "https://devblogs.microsoft.com/dotnet/feed/" }
]
```

### Behavior

- On first use of a session, returns `[]` (FR-005).
- Returns all current subscriptions in insertion order (FR-003).

---

## POST /api/subscriptions

Add a new subscription by URL.

### Request

- Method: `POST`
- Path: `/api/subscriptions`
- Headers: `Content-Type: application/json`
- Body:

```json
{ "url": "https://devblogs.microsoft.com/dotnet/feed/" }
```

| Field | Type | Required | Rules |
|-------|------|----------|-------|
| `url` | string | Yes | Non-empty after trimming. Not validated as a real/reachable feed (FR-007). |

### Responses

**Success — `201 Created`**

Returns the created subscription (and the resulting list is updated).

```json
{ "url": "https://devblogs.microsoft.com/dotnet/feed/" }
```

**Validation error — `400 Bad Request`**

Returned when `url` is missing, not a string, or empty/whitespace-only (FR-006,
constitution Principle III).

```json
{ "error": "url is required" }
```

### Behavior

- Appends the subscription to the in-memory list; existing entries are preserved (FR-008).
- Does not de-duplicate; the same URL may be added more than once (Edge Cases).
- The updated list is immediately observable via `GET /api/subscriptions` (FR-004).

---

## Notes

- No authentication (single local user, MVP Assumptions).
- No CORS configuration — the UI is served from the same origin (constitution Principle II).
- No endpoints for removal, refresh, or feed items in the MVP (deferred to later phases).
