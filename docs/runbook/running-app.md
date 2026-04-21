# Running the Application

## Overview

This guide walks you through starting all services for the Bot Admin Control application in development mode.

---

## Prerequisites

Before running the application, complete the **[Setup & Installation](./setup.md)** guide.

Verify prerequisites:
- ✅ All npm packages installed
- ✅ Environment variables configured
- ✅ DynamoDB running and accessible

---

## Service Startup Order

The services must start in this specific order:

```
1. DynamoDB (Database)
   ↓
2. Backend (API Server)
   ↓
3. Frontend (Web UI)
   ↓
4. Seeding Script (Data Loading)
```

---

## Starting Services

### Terminal 1: Start DynamoDB

```powershell
docker-compose up -d dynamodb
```

**Expected Output:**
```
[+] Running 1/1
 ✓ Container bot-admin-dynamodb  Started
```

**Verify it's running:**
```powershell
docker ps | findstr dynamodb
```

Wait a few seconds for DynamoDB to fully initialize.

---

### Terminal 2: Start Backend

```powershell
cd backend
npm run dev
```

**Expected Output:**
```
🚀 Starting Bot Admin Control API Server...
📦 Initializing DynamoDB...
📊 Setting up database...
✅ Server is running on http://localhost:3000
📚 API docs: http://localhost:3000/api
[nodemon] waiting for file changes before starting...
```

The server is ready when you see `Server is running on http://localhost:3000`.

**Test the backend:**
```powershell
curl http://localhost:3000/health
```

---

### Terminal 3: Start Frontend

```powershell
cd frontend
npm run dev
```

**Expected Output:**
```
  VITE v5.0.8  ready in 234 ms

  ➜  Local:   http://localhost:5173/
  ➜  press h + enter to show help
```

---

### Terminal 4: [Optional] Seed Database

If you want to load sample data:

```powershell
npm run seed:database
```

See [Database Seeding Guide](./seeding.md) for details.

---

## Accessing the Application

Once all services are running:

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:3000/api
- **Health Check:** http://localhost:3000/health
- **DynamoDB:** http://localhost:8000 (local access only)

---

## Development Workflow

### Making Backend Changes

The backend uses **nodemon** for auto-reload:

1. Edit files in `backend/src/`
2. Changes are automatically detected and compiled
3. Server restarts automatically
4. No need to manually restart

Example:
```powershell
# Make a change to backend/src/routes/bots.ts
# nodemon detects it and restarts server
[nodemon] restarting due to changes...
[nodemon] restarting due to changes...
✅ Server is running on http://localhost:3000
```

### Making Frontend Changes

The frontend uses **Vite** for hot module replacement (HMR):

1. Edit files in `frontend/src/`
2. Browser automatically refreshes
3. Preserves application state where possible

Example:
```powershell
# Make a change to frontend/src/components/BotList.tsx
# Vite hot-reloads in browser instantly
```

### API Proxy

During development, frontend API calls are proxied through Vite:

```
Browser Request → Vite Dev Server (:5173)
    ↓ (proxied)
Backend API (:3000)
    ↓
DynamoDB (:8000)
```

This is configured in `frontend/vite.config.ts`:
```typescript
proxy: {
  '/api': {
    target: 'http://localhost:3000',
    changeOrigin: true,
  },
}
```

---

## Stopping Services

### Stop All Services

Press `Ctrl+C` in each terminal.

### Stop Only DynamoDB

```powershell
docker-compose down
```

### Stop DynamoDB and Remove Data

```powershell
docker-compose down -v
```

Use this to reset the database for clean seeding.

---

## Multiple Development Sessions

You can have multiple development copies running simultaneously on different ports:

### Session 2 on Different Ports

```powershell
# Backend on port 3001
$env:PORT=3001
cd backend && npm run dev

# Frontend on port 5174
cd frontend && npm run dev -- --port 5174

# Or modify vite.config.ts to change the port
```

---

## Monitoring Services

### Check if Services Are Running

```powershell
# Backend health check
curl http://localhost:3000/health

# DynamoDB health check
curl http://localhost:8000/

# Frontend (just check status code)
curl -I http://localhost:5173
```

### View Logs

#### Backend Logs
Logs are displayed in Terminal 2 where you ran `npm run dev`

```
GET /api/bots 200 - 5.432 ms
GET /api/workers 200 - 3.221 ms
POST /api/logs 201 - 7.654 ms
```

#### Frontend Logs
Logs are displayed in Terminal 3 where you ran `npm run dev`

```
[plugin:vite:import-analysis] ...
[module-graph] ...
```

#### DynamoDB Logs
View container logs:
```powershell
docker logs bot-admin-dynamodb -f
```

---

## Common Issues

### Issue: Backend won't start - "Port 3000 already in use"

```
Error: listen EADDRINUSE: address already in use :::3000
```

**Solution:** Kill the process using port 3000 or use a different port
```powershell
# Find and kill process on port 3000
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Or change PORT
$env:PORT=3001
npm run dev
```

---

### Issue: Frontend can't connect to backend

**Error in browser console:**
```
GET http://localhost:5173/api/bots 404 (Not Found)
```

**Causes & Solutions:**

1. **Backend not running**
   ```powershell
   # Terminal 2: Start backend
   cd backend && npm run dev
   ```

2. **Frontend proxy misconfigured**
   - Check `frontend/vite.config.ts` has `/api` proxy
   - Ensure it points to `http://localhost:3000`

3. **Wrong API URL in environment**
   - Check `frontend/.env` has `VITE_API_URL=/api`

---

### Issue: DynamoDB connection error

```
Error: getaddrinfo ENOTFOUND dynamodb
```

**Solution:** DynamoDB not running
```powershell
docker-compose up -d dynamodb
# Wait 5-10 seconds for it to initialize
```

---

## Next Steps

After running the application:

- **View Data:** Open http://localhost:5173 in your browser
- **Load Sample Data:** Run `npm run seed:database` (see [Seeding Guide](./seeding.md))
- **Explore API:** Use Postman or curl to test endpoints
- **Check Logs:** View the [OpenAPI documentation](../../design/api/openapi.yaml)

For issues, see the **[Troubleshooting Guide](./troubleshooting.md)**.
