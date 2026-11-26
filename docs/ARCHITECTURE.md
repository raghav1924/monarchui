# MonarchUI Architecture

MonarchUI uses a zero-dependency registry & code-ownership model:
- `src/registry/components.ts`: Single source of truth for all 12 React + Tailwind and Vanilla HTML/CSS/JS components.
- `src/core/themeEngine.ts`: Generates CSS custom properties (`monarch-tokens.css`) and Tailwind config extensions (`monarch.tailwind.ts`).
- `src/core/installer.ts`: Writes self-contained files into `./components/monarch/` with zero package lock-in.
- `src/studio/server.ts`: Embedded HTTP server serving the live interactive playground on Port `7272`.
