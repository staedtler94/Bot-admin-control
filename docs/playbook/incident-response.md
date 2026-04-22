# Incident response (lightweight)

Use this when **something is wrong** in a shared or production-like environment. For command-level recovery, start with the **[Troubleshooting runbook](../runbook/troubleshooting.md)**.

## Triage order

1. **User-visible** — UI error, blank screen, 4xx/5xx in browser network tab
2. **API** — `GET /health`, then a read-only API (e.g. `GET /api/bots?limit=1`)
3. **Data plane** — DynamoDB reachable; backend logs show connection errors
4. **Recent changes** — deploy, config, dependency, or data volume change

## Information to collect

- Time range (UTC) and environment (local / docker / prod)
- Request path, method, status, and response body (redact tokens)
- Backend console or container logs; DynamoDB container logs if DB suspected
- Git revision or image tag

## Escalation

- **Data loss or security** — stop writes, snapshot volumes if applicable, rotate credentials if leaked
- **Repeated 500s** — capture stack trace from backend; check [errorHandler](../../backend/src/middleware/errorHandler.ts) behavior and DynamoDB health

## After resolution

- Document root cause and fix in your team’s channel or ticket
- Add a short entry to the troubleshooting runbook if the issue is likely to repeat
