---
title: "Tech stack for RSS Feed Reader (Node.js + Express)"
description: "Stakeholder technology choices for the RSS Feed Reader MVP, adapted from the original .NET stack to Node.js + Express"
author: "Paula Silva"
date: "2026-06-10"
version: "1.0.0"
status: "approved"
tags: ["spec-kit", "nodejs", "express", "github-copilot", "stakeholder-doc"]
---

# Tech stack for RSS Feed Reader

Our RSS feed reader will use a single **Node.js + Express** application that exposes a small REST API and serves a static HTML + vanilla JavaScript frontend from the same server. This combination allows for extremely rapid development of the MVP while supporting future production-ready enhancements.

## Why a single Node.js + Express application?

Building an RSS feed reader with one Express server offers several advantages:

1. **Quick development**: One project, one `package.json`, one process. `npm install` and `npm start` is the entire setup. No build step, no compilation, no transpilation.

2. **Single origin, zero CORS**: The frontend is served by the same Express server that exposes the API. There is no cross-origin communication, so no CORS policy, no port coordination between frontend and backend, and no API base URL configuration.

3. **Cross-platform**: Node.js runs identically on Windows, macOS, and Linux.

4. **Incremental complexity**: Start with simple subscription management (MVP), then add feed fetching (Extended-MVP), then add persistence and advanced features.

5. **Future-ready architecture**: While the MVP is minimal (just subscription list management), this architecture supports adding:

   - Feed fetching and parsing (`rss-parser`)
   - Database persistence (`better-sqlite3`)
   - Scheduled background refresh (`node-cron`)
   - Advanced features (read/unread, folders, etc.)

6. **One language everywhere**: JavaScript on the server and in the browser, with no context switching.

## Responsibilities

For the MVP (subscription management only):

**Backend (Express API routes)** is responsible for:

- Exposing an API to add subscriptions (`POST /api/subscriptions`)
- Storing subscriptions in memory (a simple JavaScript array)
- Returning the list of subscriptions (`GET /api/subscriptions`)

**Frontend (static files in `public/`)** is responsible for:

- Subscription management UI (input field + add button)
- Displaying the list of subscriptions
- Calling the API with the browser `fetch` API (relative URLs, same origin)

For the Extended-MVP (add feed fetching):

**Backend** adds:

- Fetching and parsing RSS/Atom feeds when requested (`rss-parser`)
- Returning feed items to the UI (`GET /api/feeds?url=...` or per-subscription items endpoint)

**Frontend** adds:

- Manual refresh button
- Displaying items (title and link minimum)
- Basic error messages

## MVP-first implementation approach

To deliver the MVP quickly:

**MVP (subscription management only):**

- **Storage**: Use in-memory storage (a JavaScript array of strings or simple objects). Subscriptions are lost when the app stops. This is acceptable for the MVP.
- **No feed operations**: No HTTP client, no parsing library, no feed fetching.
- **Focus**: Basic UI and API communication (add subscription, get subscriptions list).
- **Dependencies**: `express` only. Nothing else.

**Extended-MVP (add feed fetching):**

- **Parsing**: Add `rss-parser` for RSS/Atom parsing. It handles fetching and parsing in a single call (`parser.parseURL(feedUrl)`), so no separate HTTP client library is needed.
- **Refresh**: Manual only. No background polling or scheduling.
- **Error handling**: Simple "failed to load" messages, no detailed diagnostics.
- **Content display**: Plain text only (title + link), no HTML rendering needed.

This incremental approach makes development extremely fast while keeping the architecture clean for future enhancements.

## Local development

### Prerequisites

- **Node.js 20 LTS or later** (includes npm). Verify with `node --version` and `npm --version`.
- No global packages, build tools, or compilers are required.

### Project structure

Keep the project intentionally flat and simple:

```text
RSSFeedReader (root)
├── server.js              (Express app: API routes + static file serving)
├── package.json           (dependencies and start script)
├── public/                (static frontend served by Express)
│   ├── index.html         (subscription management UI)
│   ├── app.js             (frontend logic using fetch)
│   └── styles.css         (basic styling)
└── .gitignore             (must include node_modules/)
```

Implementation guidance for the project skeleton:

- `server.js` must call `app.use(express.json())` for JSON request bodies and `app.use(express.static('public'))` to serve the frontend.
- API routes must be defined under the `/api/` prefix to avoid conflicts with static files.
- The frontend must call the API with relative paths (for example, `fetch('/api/subscriptions')`). Never hardcode `http://localhost` URLs in frontend code.
- `package.json` must define `"start": "node server.js"` in the `scripts` section.
- `.gitignore` must include `node_modules/` before the first commit.

### Port configuration

The entire application runs on a **single port**. There is no separate frontend port, no API base URL configuration, and no CORS policy.

- Default: `http://localhost:3000`
- Read the port from the environment with a fallback: `const PORT = process.env.PORT || 3000;`
- Both the UI and the API are reachable on the same origin: the UI at `http://localhost:3000/` and the API at `http://localhost:3000/api/subscriptions`.

### Running and verifying the application

Start the application from the project root:

```bash
npm install
npm start
```

Verify the API directly before testing the UI:

```bash
# List subscriptions (should return [] initially)
curl http://localhost:3000/api/subscriptions

# Add a subscription
curl -X POST http://localhost:3000/api/subscriptions -H "Content-Type: application/json" -d "{\"url\": \"https://devblogs.microsoft.com/dotnet/feed/\"}"
```

Then open `http://localhost:3000` in a browser and test the UI.

**For MVP:** Test by adding subscription URLs and verifying they appear in the list.

**For Extended-MVP:** Test with a known-good feed like <https://devblogs.microsoft.com/dotnet/feed/>

### Common pitfalls to avoid

- **Do not split frontend and backend into separate servers or projects.** A separate frontend dev server reintroduces CORS and port coordination, which this architecture intentionally avoids.
- **Do not add a frontend framework or build step.** No React, Vue, bundlers, or transpilers. Plain HTML + vanilla JavaScript is a project requirement for the MVP.
- **Do not commit `node_modules/`.** Confirm `.gitignore` is in place before the first commit.
- **Define API routes before any catch-all or 404 handler** in `server.js`, otherwise API calls may return the HTML page instead of JSON.

## Future enhancements (post-MVP)

When ready to extend beyond the basic demonstration, this architecture supports:

- **Database persistence**: Add `better-sqlite3` for storing subscriptions and items between sessions (synchronous API, zero configuration, single file database)
- **Background polling**: Add `node-cron` to automatically refresh feeds on a schedule
- **HTML sanitization**: Add `sanitize-html` to safely display rich content from feeds
- **Input validation**: Add stricter URL validation on the API (the MVP only needs basic checks)
- **Better error handling**: Implement retry logic, timeouts, and detailed error messages
- **Testing**: Add unit and integration tests using `vitest` and `supertest`
- **Optimization**: Implement HTTP caching (ETag/Last-Modified), de-duplication, and performance improvements

## Summary

A single Node.js + Express application provides the most direct path to building the RSS feed reader incrementally:

- **MVP**: Subscription management only (add + list), one dependency (`express`), in-memory storage, no feed operations
- **Extended-MVP**: Add feed fetching and item display with `rss-parser`, still in-memory and manual refresh
- **Future**: Add persistence, scheduled refresh, and advanced features

The architecture is intentionally minimal to enable fast development, while the technology choices support adding production-ready features later without requiring a complete rewrite.

## References

- [Express documentation](https://expressjs.com/)
- [Node.js downloads (LTS)](https://nodejs.org/en/download)
- [rss-parser on npm](https://www.npmjs.com/package/rss-parser)
- [better-sqlite3 on npm](https://www.npmjs.com/package/better-sqlite3)
- [GitHub Spec Kit repository](https://github.com/github/spec-kit)