# Operations

Day-to-day checks for a running **Bot Admin Control** stack. For first-time install, use [setup](./setup.md). For break/fix, use [troubleshooting](./troubleshooting.md).

## Service map

| Service | Default URL | Notes |
|---------|----------------|--------|
| Frontend (Vite dev) | http://localhost:5173 | Proxies ` /api` → backend |
| Backend API | http://localhost:3000 | Base path `/api` for REST resources |
| Health (no `/api` prefix) | http://localhost:3000/health | JSON `{ success, message, timestamp }` |
| DynamoDB Local | http://localhost:8000 | Empty JSON `{}` on `GET /` is normal |

## Quick health checks

```bash
# Health endpoint (backend)
curl -sS http://localhost:3000/health | jq .

# DynamoDB process responding
curl -sS http://localhost:8000/

# API sample (requires data / seed)
curl -sS "http://localhost:3000/api/bots?limit=1" | jq .
```

Windows PowerShell: omit `| jq .` or install `jq`.

## Logs

| What | Where |
|------|--------|
| HTTP access-style lines | Backend terminal (see `requestLogger`) |
| Application errors | Backend stderr / container logs |
| DynamoDB | `docker logs bot-admin-dynamodb` (compose service name may vary) |
| Frontend | Browser DevTools console; Vite terminal |

## Restart order (safe)

1. Stop frontend and backend (Ctrl+C in dev terminals)
2. Optional: `docker compose stop dynamodb` (or `docker compose down` if you intend to keep volumes)
3. Start **DynamoDB** first, wait until healthy
4. Start **backend**, wait for listen + DB init
5. Start **frontend**
6. Re-run **seed** only if you wiped data ([seeding](./seeding.md))

## API contract

Authoritative list of paths and parameters: [openapi.yaml](../design/api/openapi.yaml). When debugging 404/400, compare your request to that file and to route files under `backend/src/routes/`.

## Worker composite keys

Some endpoints require **both** a worker id and a **bot** id (query `botId` or path segment depending on route). A **400** with `Bot ID is required` means the client omitted `botId` where the API expects it.

## Backup and reset (local)

- **Reset DynamoDB data** (destructive): see [seeding — Clearing database](./seeding.md)
- **Do not** commit real AWS credentials; local uses dummy `AWS_ACCESS_KEY_ID` / `AWS_SECRET_ACCESS_KEY` in `.env` examples

## Automation hooks (CI)

From repo root, quality gates used in development:

- `npm run check:all` — typecheck + lint for backend and frontend
- `cd backend && npm run test:ci` — tests + coverage thresholds + reports

See [testing playbook](../playbook/testing-and-quality.md).
