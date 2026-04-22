# Releases and deployments

This project is optimized for **local development** and **Docker Compose**. Production on AWS (or elsewhere) is outlined in [ARCHITECTURE.md](../design/ARCHITECTURE.md) as a future direction.

## Local full stack (Docker Compose)

From the repository root:

```bash
docker compose up
```

Typical layout (see [docker-compose.yml](../../docker-compose.yml)):

- **DynamoDB Local** — port **8000**
- **Backend** — port **3000**, `DYNAMODB_ENDPOINT` points at the `dynamodb` service
- **Frontend** — port **5173**; compose may set `REACT_APP_API_URL` / similar; the Vite app normally uses `VITE_*` — align env with your `Dockerfile` and frontend build

After changes to **Dockerfiles** or **compose**, rebuild:

```bash
docker compose build --no-cache
docker compose up
```

## Production-like checks (no container)

- **Backend**: `cd backend && npm run build && npm start` (ensure `.env` points at a reachable DynamoDB)
- **Frontend**: `cd frontend && npm run build && npm run preview` — confirm `VITE_API_URL` (or proxy) points at the API base URL the browser will use

## Environment matrix

| Variable | Local dev (typical) | Docker backend service |
|----------|----------------------|---------------------------|
| `DYNAMODB_ENDPOINT` | `http://localhost:8000` | `http://dynamodb:8000` |
| `PORT` / backend listen | `3000` | `3000` |
| Frontend API base | `/api` via Vite proxy | Full URL to backend if not proxied |

## Release checklist (suggested)

- [ ] `npm run check:all` and backend `npm run test:ci` pass
- [ ] `docker compose up` smoke test: UI loads, health and sample API calls succeed (see [operations runbook](../runbook/operations.md))
- [ ] Changelog or release notes updated for user-visible changes
- [ ] Version bumps in `package.json` if you publish images or artifacts

## Database migrations

There is no separate migration tool: **table creation** runs via backend startup (`setupDatabase`). For a clean room, you may use compose volume reset (see [Seeding runbook](../runbook/seeding.md) “Clearing database”).
