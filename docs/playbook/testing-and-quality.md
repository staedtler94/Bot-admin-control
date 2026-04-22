# Testing and quality

## Backend (`backend/`)

| Command | Purpose |
|---------|---------|
| `npm test` | Jest unit and route tests (snapshots, mocks) |
| `npm run test:watch` | Watch mode while developing tests |
| `npm run test:coverage` | Coverage report under `backend/coverage/` |
| `npm run test:ci` | CI-style: coverage + thresholds + JUnit/HTML under `backend/reports/` |
| `npm run typecheck` | `tsc` over app + tests (`tsconfig.test.json`) |
| `npm run lint` | ESLint on `src/`, `tests/`, `jest.config.ts` |

From **repo root**:

```bash
npm run typecheck:backend
npm run lint:backend
npm run check:backend   # typecheck then lint
```

## Frontend (`frontend/`)

| Command | Purpose |
|---------|---------|
| `npm run typecheck` | `tsc --noEmit` |
| `npm run lint` | ESLint on `src/` |
| `npm run build` | Production typecheck + Vite build |

From **repo root**:

```bash
npm run typecheck:frontend
npm run lint:frontend
npm run check:frontend
```

## All packages (repo root)

```bash
npm run check:all
```

Runs backend + frontend typecheck and lint. Use before a PR or shared merge.

## Formatting

Backend and frontend include **Prettier** scripts (`npm run format`) in their `package.json`. Run in the package you changed; keep style consistent with existing files.

## What “green” means

- **Backend**: `npm run test:ci` passes (if your pipeline uses it) and `npm run check` passes
- **Frontend**: `npm run build` and `npm run check` pass
- **Docs**: If you change HTTP behavior, update [openapi.yaml](../design/api/openapi.yaml)
