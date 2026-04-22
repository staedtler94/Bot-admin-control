# Bot Admin Control — Runbooks

Runbooks are **step-by-step operational guides**: install, run, seed, verify, and recover. For **team workflows** (PRs, quality gates, releases), use the **[playbook](../playbook/Readme.md)**.

## Index

| Document | Purpose |
|----------|---------|
| **[Setup and installation](./setup.md)** | Prerequisites, `npm install`, env files, start DynamoDB |
| **[Running the application](./running-app.md)** | Order of services, dev commands, Vite proxy, stop/start |
| **[Database seeding](./seeding.md)** | `npm run seed:database`, data files, clearing data |
| **[Operations](./operations.md)** | Health URLs, quick curls, logs, restart order, API contract pointer |
| **[Troubleshooting](./troubleshooting.md)** | Common errors (ports, CORS, DynamoDB, seed failures) |

## Quick start (bash / zsh)

**Prerequisites:** Node.js 20+, npm, Docker (for DynamoDB).

**Automated install + printed workflow (recommended for new clones):**

```bash
cd /path/to/Bot-admin-control
npm install
npm run setup
```

`setup` runs `npm install` in the repo root, `backend/`, and `frontend/`, then prints the multi-terminal steps below. To only show those steps: `npm run setup:help`.

**Manual install** (equivalent to what `setup` does for dependencies):

```bash
# 1) Dependencies
cd /path/to/Bot-admin-control
npm install
cd backend && npm install && cd ..
cd frontend && npm install && cd ..

# 2) Database
npm run docker:dynamodb
# or: docker compose up -d dynamodb
# wait until the container is healthy

# 3) Backend (terminal 1)
cd backend && npm run dev

# 4) Frontend (terminal 2)
cd frontend && npm run dev

# 5) Optional sample data (terminal 3, backend must be up)
npm run seed:database
```

- **UI:** http://localhost:5173  
- **API:** http://localhost:3000/api  
- **Health:** http://localhost:3000/health  

Windows users can follow the same flow in PowerShell; [setup](./setup.md) includes Windows-oriented examples.

## Quality checks (from repo root)

```bash
npm run check:all
```

Backend tests:

```bash
cd backend && npm test
```

Details: [Testing and quality playbook](../playbook/testing-and-quality.md).

## Docker Compose (full stack)

```bash
docker compose up
```

See [ARCHITECTURE.md](../design/ARCHITECTURE.md) and [Releases playbook](../playbook/releases-and-deployments.md) for service wiring and environment variables.

## Related docs

| Resource | Link |
|----------|------|
| Architecture | [../design/ARCHITECTURE.md](../design/ARCHITECTURE.md) |
| OpenAPI / REST contract | [../design/api/openapi.yaml](../design/api/openapi.yaml) |
| Project README (overview) | [../../README.md](../../README.md) |
