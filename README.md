# Paper Plan

A local-first todo app with a dark-green paper aesthetic. Everything is stored in
`localStorage` — no account, no server.

Refactored from a single `index.html` into a **Vite + React + Tailwind CSS v4**
project.

## Stack

- [Vite](https://vitejs.dev/) + [React 19](https://react.dev/)
- [Tailwind CSS v4](https://tailwindcss.com/) via `@tailwindcss/vite` (design
  tokens defined in `src/styles.css` under `@theme`)

## Getting started

```sh
npm install
npm run dev      # local dev server (served at /todo/)
npm run build    # production build to dist/
npm run preview  # serve the production build
```

## Live

Published to GitHub Pages at <https://sluo490.github.io/todo/> via
`.github/workflows/pages.yml` (builds on push to `main`). The `base: "/todo/"`
in `vite.config.js` must match the repo name. To enable it once: repo
Settings → Pages → Source: **GitHub Actions**.

## Structure

```
index.html              Vite entry (fonts + #root)
src/
  main.jsx              React root
  App.jsx               state, actions, layout
  styles.css            Tailwind import, @theme tokens, component CSS
  components/
    Background.jsx      ambient glows, sparkles, grain
    Header.jsx          brand, weekday, mood, status area
    Clock.jsx           live local time
    Ring.jsx            progress circle (ALL CLEAR stamp lives in Header)
    Composer.jsx        new-task input, tag chips, urgent flag
    Toolbar.jsx         filters, counts, copy/clear actions
    TaskList.jsx        drag-to-reorder list
    TaskItem.jsx        single task card (toggle, edit, delete)
    EmptyState.jsx      context-aware empty state
    Footer.jsx          shortcuts + save indicator
    Toast.jsx           undo toasts with drain bar
  hooks/
    useNow.js           ticking clock hook
  lib/
    constants.js        storage key, circle math, tags, confetti colors
    storage.js          seed / load / save (localStorage)
    time.js             date, mood, time formatting
    utils.js            id generation
    confetti.js         "all done" particle burst
```

## Notes

- State lives in one object (`tasks`, `filter`, `selTag`) persisted under the
  `paperplan.v1` localStorage key, so data survives the refactor.
- One-off layout is written as Tailwind utilities in JSX; stateful/decorative
  CSS (pseudo-elements, keyframes, `.on`/`.done`/`.dragging`/`.shake` states,
  media queries) stays in `src/styles.css`.
- `index.html.bak` is the original single-file app, kept for reference.
