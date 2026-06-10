# Quickstart: MVP RSS Reader — Subscription Management

**Feature**: `001-rss-subscriptions-mvp` | **Date**: 2026-06-10

This guide verifies the MVP end-to-end after implementation (constitution Principle V).

## Prerequisites

- Node.js 20 LTS or later. Verify:

  ```bash
  node --version
  npm --version
  ```

## Install and run

From the repository root:

```bash
npm install
npm start
```

Expected: the server starts with no errors and listens on `http://localhost:3000`
(or `$PORT` if set).

## Verify the API

```bash
# 1) List subscriptions — should return [] on first run
curl http://localhost:3000/api/subscriptions

# 2) Add a subscription
curl -X POST http://localhost:3000/api/subscriptions \
  -H "Content-Type: application/json" \
  -d '{"url": "https://devblogs.microsoft.com/dotnet/feed/"}'

# 3) List again — should now include the added URL
curl http://localhost:3000/api/subscriptions

# 4) Reject empty input — should return 400
curl -i -X POST http://localhost:3000/api/subscriptions \
  -H "Content-Type: application/json" \
  -d '{"url": "   "}'
```

## Verify the UI

1. Open `http://localhost:3000` in a browser.
2. Confirm an empty subscription list is shown on first load (FR-005).
3. Paste a feed URL into the input and click Add.
4. Confirm the URL appears in the list immediately (FR-001, FR-004).
5. Add a second URL and confirm both appear (FR-008).
6. Open DevTools → Console and confirm there are no errors during load or add.

## Acceptance mapping

| Step | Validates |
|------|-----------|
| API step 1 / UI step 2 | FR-003, FR-005, SC-004 |
| API step 2–3 / UI step 3–4 | FR-001, FR-002, FR-004, SC-001, SC-002, SC-003 |
| API step 4 | FR-006 (empty input rejected) |
| UI step 5 | FR-008 (existing entries preserved) |
| UI step 6 | Clean run, no console errors (Principle V) |

## Notes

- Subscriptions are in memory only; restarting the server clears the list (expected MVP
  behavior, not a bug).
- No feed fetching/parsing occurs in the MVP — adding a URL never makes a network request.
