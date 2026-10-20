# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Paper Plan — a local-first todo app (dark-green paper aesthetic). No backend, no accounts, no network: everything persists in `localStorage` under the `paperplan.v1` key (`src/lib/constants.js`). There is no test framework and no linter configured — verify changes with `npm run dev` in the browser.

## Commands

```sh
npm install      # dependencies (react 19, vite, tailwindcss v4)
npm run dev      # dev server
npm run build    # production build to dist/
npm run preview  # serve the production build
```

There are no test or lint scripts. `index.html.bak` is the pre-refactor single-file app, kept for reference only (gitignored via `*.bak`) — don't edit it.

## Architecture

**Single state object, one owner.** `App.jsx` holds the entire app state as one object `{tasks, filter, selTag}`, initialized from `load() || seed()` (`src/lib/storage.js`). All other components are presentational and receive props + callbacks. `stateRef` mirrors the state so event handlers always read the latest value.

**`commit()` vs `update()` — deliberate split.** In `App.jsx`:
- `commit(updater)` updates state *and* persists to localStorage.
- `update(updater)` updates state *without* persisting.

Drag-reorder uses `update()` on every drag-over (high-frequency, no storage writes) and `commitReorder()` persists once on drop. Use `commit()` for discrete user actions (add/toggle/edit/delete, filter, tag). Don't "simplify" this away — it exists to avoid localStorage churn during drags.

**Undo pattern.** Delete and clear-done snapshot the removed tasks (with their original indices) and offer an "Undo" toast action that splices them back at the original positions. Keep this pattern when adding destructive actions.

**Styling convention (Tailwind v4).**
- Design tokens (colors, fonts) are defined in `src/styles.css` under `@theme` — there is **no `tailwind.config.js`**; Tailwind v4 is wired via the `@tailwindcss/vite` plugin in `vite.config.js`.
- One-off layout is written as Tailwind utility classes in JSX.
- Stateful or decorative CSS (pseudo-elements, keyframes, `.on`/`.done`/`.dragging`/`.shake` states, media queries) lives in `src/styles.css`. Add new stateful CSS there, not as utilities in JSX.

**Other notes**
- Confetti burst (`src/lib/confetti.js`) fires when the last task is toggled done; it respects `prefers-reduced-motion` (`REDUCED_MOTION` in constants).
- The `/` keyboard shortcut focuses the composer (handled in `App.jsx`); it's documented in the Footer.
- `storage.js` `save()` returns `false` when localStorage is unavailable (private mode); `App.jsx` surfaces a one-time warning toast. Preserve this graceful degradation.
