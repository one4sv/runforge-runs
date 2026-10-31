# Runforge — Runs dashboard

Junior Frontend test assignment implemented using **React 18 + TypeScript + Vite**. This is a standalone frontend project with a local Promise-based mock service; no real backend, API keys, or AI agent are required.

## Live demo

**Deployed application:** https://runforge-runs-psi.vercel.app/

## Quick start

Requirements: Node.js 20+ and npm.

```bash
npm install
npm run dev
```

Open the URL Vite prints (typically http://localhost:5173).

For production and tests:

```bash
npm run build
npm run preview
npm test
```

## Features

- Full-width responsive dashboard with sidebar, summary cards, six data columns and a right-side **420px** run-details drawer.
- Minimum 360px mobile width. Table scrolls horizontally on smaller viewports; the details drawer fills the screen on mobile.
- Search by **run name or repository**, in combination with **All / Queued / Running / Succeeded / Failed** status filters.
- Sort by **creation date** or **duration** (click a sortable header again to reverse the direction).
- Filter and search persisted in URL query parameters: `?status=running&search=web`.
- Click a row or use Enter/Space to open its details; close with the button, Escape, or backdrop on mobile.
- Details show branch, repository, date, duration, logs, and result where available; copy logs to clipboard.
- Loading skeleton (650ms artificial delay), empty search result, and error with a retry action. Use **Simulate error** to demonstrate failure; **Retry** restores data.
- 10 mock runs covering all four statuses, with absent optional `durationSeconds` and `result` on some runs.
- Three Vitest tests for status filtering, searching with status, and opening/closing details.
- Keyboard: **Ctrl/Cmd+K** focuses search; **Escape** closes run details.

## Project organization

- `src/types.ts`: `Run` and status types.
- `src/data/runs.ts`: fixture data.
- `src/services/runs.ts`: asynchronous Promise-based mock service.
- `src/utils/runs.ts`: search, filtering, sorting, dates and durations.
- `src/components/Sidebar.tsx`: sidebar.
- `src/components/RunFilters.tsx`: search and status controls.
- `src/components/RunsTable.tsx`: six-column runs table.
- `src/components/RunDetails.tsx`: details drawer and logs.
- `src/components/StatusBadge.tsx`: accessible textual status labels.
- `src/App.tsx`: top-level state and integration.
- `src/styles.css`: design system and responsive layout.
- `src/__tests__/runs.test.tsx`: UI and filter tests.

## Manual verification

1. Refresh and observe the loading skeleton, then the runs list.
2. Select each status: only matching runs remain, with visible selection.
3. Search `web-platform`; then select Running: only the two running runs from that repository remain.
4. Search a random string: empty state appears. Clear filters.
5. Open a run: details, logs and result (when available) are shown. Close with X or Escape.
6. Use Simulate error: error state shows; Retry recovers.
7. Sort by Created or Duration, then click again to reverse order.
8. Reload with `?status=failed&search=worker` and verify the query is restored.
9. Resize down to 360px: layout remains usable, table scrolls horizontally, and details are full-screen.

## Notes

The sidebar's other destinations and the New Run action are deliberately not implemented: the task requests only the Runs page, not a full backend/platform. The dashboard is an original interpretation of the specified cream/navy Runforge style, not a pixel-by-pixel clone. Times are formatted in the viewer's local timezone.
