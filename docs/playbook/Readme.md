# Bot Admin Control — Playbooks

Playbooks describe **how we work**: workflows, conventions, and quality gates so the team ships consistently. For **day-to-day commands** (start/stop, seed, troubleshoot), use the **[runbook](../runbook/Readme.md)**.

## Playbook vs runbook

| | **Playbook** | **Runbook** |
|---|--------------|---------------|
| **Audience** | Engineers planning and changing the system | Anyone operating or debugging a running stack |
| **Content** | Branching, reviews, tests, release expectations | Ordered steps, ports, health checks, recovery |
| **When to open** | Before a PR, when adding features, when defining “done” | When something won’t start, connect, or seed |

## Index

| Document | Purpose |
|----------|---------|
| **[Development workflow](./development-workflow.md)** | Branching, local setup order, env files, definition of done |
| **[Testing and quality](./testing-and-quality.md)** | Backend tests, lint, typecheck, when to run what |
| **[Releases and deployments](./releases-and-deployments.md)** | Docker Compose stack, build/preview, production notes |
| **[Incident response](./incident-response.md)** | triage order, what to capture, when to escalate |

## Related design docs

- [Architecture](../design/ARCHITECTURE.md) — system design
- [OpenAPI spec](../design/api/openapi.yaml) — HTTP contract (source of truth for routes and examples)
