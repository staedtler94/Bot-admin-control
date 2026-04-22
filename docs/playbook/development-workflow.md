# Development workflow

## Prerequisites

- **Node.js** 20.x (see root and package `engines` if added; align with [README](../../README.md))
- **npm** (comes with Node)
- **Docker** (for DynamoDB Local)
- **Git**

## Clone and install

From the repository root, either use the **setup helper** (installs in root, `backend/`, and `frontend/`, then prints the dev commands):

```bash
npm install
npm run setup
```

Or install manually:

```bash
npm install
cd backend && npm install && cd ..
cd frontend && npm install && cd ..
```

`npm run setup:help` only prints the multi-terminal workflow (no installs).

Root `package.json` holds repo-level scripts (DynamoDB, seeding, cross-package checks). Backend and frontend each have their own dependencies.

## Typical local loop

1. Start **DynamoDB**: `npm run docker:dynamodb` (from repo root) or `docker compose up -d dynamodb`
2. Start **backend**: `cd backend && npm run dev` (listens on port **3000** by default)
3. Start **frontend**: `cd frontend && npm run dev` (Vite on **5173**; `/api` is proxied to the backend)
4. Optional: **seed data** with backend up: `npm run seed:database` from repo root

Details: [Running the application](../runbook/running-app.md), [Setup](../runbook/setup.md), [Seeding](../runbook/seeding.md).

## Environment configuration

- **Backend** — use `backend/.env` (not committed) for `DYNAMODB_ENDPOINT`, `PORT`, AWS dummy keys for local DynamoDB, etc. See [Setup](../runbook/setup.md).
- **Frontend** — `VITE_API_URL` defaults to `/api` in dev so the Vite proxy forwards to `http://localhost:3000`.

Never commit secrets. For production, use environment injection or a secrets manager (future hardening).

## Branching and commits

- Use short-lived feature branches from `main` (or your team’s default branch).
- Keep commits focused; reference issues when applicable.
- **Commit author**: Git uses `user.name` / `user.email` from local or global config (`git config --list --show-origin`).

## Code review checklist (author)

- [ ] `npm run check` passes in **backend** and **frontend** (or `npm run check:all` from repo root)
- [ ] Backend: `npm test` (and `npm run test:ci` before release-style merges if you rely on coverage thresholds)
- [ ] UI changes manually smoke-tested (bots list, bot detail, workers, logs)
- [ ] API changes reflected in [openapi.yaml](../design/api/openapi.yaml) when contracts change

## Definition of done

- Feature works against **local** DynamoDB + API + UI as documented in the runbook
- No new lint or typecheck failures in touched packages
- Tests updated or added when behavior is user-visible or contract-critical
