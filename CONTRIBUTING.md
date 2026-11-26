# Contributing to RenderJet

Thank you for your interest in contributing to **RenderJet (RJ)**! We welcome bug reports, documentation improvements, new UI primitives, and refinements to the Three.js spatial studio.

---

## Getting Started

1. **Fork** the repository on GitHub and clone your fork locally:
   ```bash
   git clone https://github.com/raghav1924/renderjet.git
   cd renderjet
   npm install
   ```
2. **Start the development server** on port `7272`:
   ```bash
   npm run dev
   ```
3. **Create a feature branch** from `main`:
   ```bash
   git checkout -b feat/your-feature-name
   ```

---

## Component & Code Guidelines

Every component in RenderJet follows four core principles:

1. **Zero External Runtime Dependencies:** Components must be self-contained using React, Tailwind CSS, and browser APIs (or Three.js only for the spatial stage).
2. **React + Vanilla Parity:** Registry components in `src/registry/components.ts` should provide both `reactCode` and `vanillaCode`, plus complete `props` documentation and usage snippets in `src/registry/usage.ts`.
3. **Zero Layout Shifts:** Prefer GPU-composited `transform` and `opacity` animations over layout-triggering properties.
4. **Light & Dark Mode Support:** Test every UI change in both dark mode (default) and light mode.

---

## Verification Before Opening a PR

Run both checks and ensure they pass with zero errors:

```bash
# 1. Type-check the Next.js application
./node_modules/.bin/tsc --noEmit

# 2. Build the CLI and run the test suite
npm test

# 3. Verify production Next.js build
npm run build
```

---

## Pull Request Process

1. Keep PRs focused on a single feature, component, or fix.
2. Include screenshots or a short screen recording for visual/UI changes.
3. Update `README.md` if you add or change CLI flags, components, or environment setup.
4. Link any related GitHub issue in your PR description.

By contributing, you agree that your contributions will be licensed under the [MIT License](LICENSE).
