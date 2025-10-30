# Repository Guidelines

## Project Structure & Module Organization
- `app/` — Next.js routes, layouts, and global styles (`app/page.tsx`, `app/layout.tsx`).
- `components/` — Reusable UI broken into `atoms`, `molecules`, `organisms`, and `templates`; most feature work happens here.
- `lib/` — Cross-cutting utilities (`i18n`, localized data loader, animation helpers).
- `public/data/<locale>/` — JSON data per locale (currently `en`).
- `translations/` — Locale-specific UI copy (mirrors keys consumed by components).

## Build, Test, and Development Commands
- `npm run dev` — Launches the Next.js dev server with hot reload.
- `npm run build` — Produces the production bundle and runs `next export` to emit the static site into `out/`.
- `npm run start` — Serves the production build locally (useful for smoke tests).
- `npm run lint` — Executes ESLint with the Next.js config.
- `npm run deploy` — Publishes the generated `out/` directory via `gh-pages`.

## CI/CD
- GitHub Actions workflow `deploy.yml` builds on pushes to `main`, linting and exporting the static site.
- The workflow deploys `out/` to the `main` branch of `pokleung5/pokleung5.github.io` via `peaceiris/actions-gh-pages`.
- Supply a fine-scoped PAT named `GH_PAGES_DEPLOY_TOKEN` (repo or public_repo scope) so the workflow can push to the pages repo.

## Coding Style & Naming Conventions
- Use TypeScript with React Server Components unless a client boundary is required (`'use client'` annotations).
- Prefer functional components, Tailwind utility classes, and the established folder taxonomy.
- Maintain 2-space indentation, single quotes for strings, and descriptive component/file names (e.g., `ImpactHighlights.tsx`).
- Run `npm run lint` before committing; auto-fix issues or document deviations.

## Testing Guidelines
- Automated tests are not yet configured; when adding them, colocate with the feature (`*.test.ts(x)`) and document the invocation command.
- Expect new features to include at least smoke-level coverage (component-level or Playwright-style checks once tooling exists).

## Commit & Pull Request Guidelines
- Follow concise commit summaries in imperative mood (e.g., “Add localized data loader”).
- Each PR should include: purpose summary, testing evidence (commands run), and screenshots for UI-facing changes.
- Link relevant issues or tickets and describe migration steps if you touch data files or translations.

## Agent-Specific Notes
- When introducing new locales, duplicate the JSON payloads under `public/data/<locale>/` and extend `translations/<locale>.json`.
- Keep localized fetches resilient by favoring the helper in `lib/data.ts` instead of ad-hoc `fetch` calls.
