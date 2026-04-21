# Troubleshooting Guide

## Overview

This guide covers common issues and solutions for running the Bot Admin Control application.

---

## Table of Issues

- [Installation Issues](#installation-issues)
- [Database Issues](#database-issues)
- [Backend Issues](#backend-issues)
- [Frontend Issues](#frontend-issues)
- [API & Connectivity Issues](#api--connectivity-issues)
- [Seeding Issues](#seeding-issues)
- [Performance Issues](#performance-issues)

---

## Installation Issues

### npm install fails with permission errors

**Error:**
```
npm error! code EACCES
npm error! syscall mkdir
npm error! path /usr/local/lib/node_modules
```

**Solutions:**

Option 1: Use sudo (not recommended)
```bash
sudo npm install -g npm
```

Option 2: Fix npm permissions
```bash
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
export PATH=~/.npm-global/bin:$PATH
```

Option 3: Use a Node version manager (recommended)
- Install [nvm](https://github.com/nvm-sh/nvm) (Linux/Mac)
- Install [nvm-windows](https://github.com/coreybutler/nvm-windows) (Windows)

---

### npm install fails with network timeout

**Error:**
```
npm ERR! code ETIMEDOUT
npm ERR! errno ETIMEDOUT
npm ERR! network request to https://registry.npmjs.org/package failed
```

**Solutions:**

Option 1: Increase timeout
```bash
npm install --legacy-peer-deps --timeout 60000
```

Option 2: Clear npm cache
```bash
npm cache clean --force
npm install
```

Option 3: Use different npm registry
```bash
npm config set registry https://registry.npm.taobao.org
npm install
npm config set registry https://registry.npmjs.org
```

---

### Node version incompatibility

**Error:**
```
npm ERR! engines node@^16.0.0
npm ERR! node: 14.0.0
```

**Solution:** Upgrade Node.js to version 18+
```bash
# Check current version
node --version

# Update Node.js from https://nodejs.org/
# Or use nvm
nvm install 18
nvm use 18
```

---

## Database Issues

### DynamoDB container fails to start

**Error:**
```
docker: Error response from daemon: Conflict. The container name "/bot-admin-dynamodb" is already in use
```

**Solutions:**

Option 1: Remove existing container
```powershell
docker-compose down
docker-compose up -d dynamodb
```

Option 2: Remove all stopped containers
```powershell
docker container prune
docker-compose up -d dynamodb
```

---

### DynamoDB not responding / health check failing

**Error:**
```
DynamoDB fails health check after 5 attempts
```

**Solutions:**

Option 1: Check container status
```powershell
docker ps | findstr dynamodb
docker logs bot-admin-dynamodb
```

Option 2: Increase DynamoDB startup time
```powershell
# Add delay before starting backend
docker-compose up -d dynamodb
Start-Sleep -Seconds 15  # Wait 15 seconds
cd backend && npm run dev
```

Option 3: Rebuild container
```powershell
docker-compose down -v
docker-compose pull
docker-compose up -d dynamodb
```

---

### Cannot connect to DynamoDB (ENOTFOUND dynamodb)

**Error:**
```
Error: getaddrinfo ENOTFOUND dynamodb
Error: connect ECONNREFUSED 127.0.0.1:8000
```

**Cause:** DynamoDB container not running or not accessible

**Solutions:**

Option 1: Verify DynamoDB is running
```powershell
docker ps | findstr dynamodb

# If not running, start it
docker-compose up -d dynamodb
```

Option 2: Check port is accessible
```powershell
curl http://localhost:8000/

# Should return: {}
```

Option 3: Check Docker network
```powershell
docker network ls
docker inspect bot-admin-network

# If using Docker Compose, network should be created automatically
```

---

### Port 8000 already in use

**Error:**
```
Error: bind: address already in use
```

**Solutions:**

Option 1: Kill the process using the port
```powershell
# Find process ID
netstat -ano | findstr :8000

# Kill it
taskkill /PID <PID> /F
```

Option 2: Use a different port
```powershell
# Modify docker-compose.yml
# Change "8000:8000" to "8001:8000"
# Update backend DYNAMODB_ENDPOINT to http://localhost:8001
```

---

## Backend Issues

### Backend won't start - "Cannot find module"

**Error:**
```
Error: Cannot find module '@aws-sdk/client-dynamodb'
```

**Solution:** Install dependencies
```powershell
cd backend
npm install
```

---

### Backend crashes on startup

**Error:**
```
Failed to start server: Error: ENOTFOUND dynamodb
[nodemon] app crashed - waiting for file changes before starting...
```

**Causes & Solutions:**

1. **DynamoDB not running**
   ```powershell
   docker-compose up -d dynamodb
   ```

2. **Table creation failed** - Check logs
   ```powershell
   docker logs bot-admin-dynamodb
   ```

3. **Wrong DYNAMODB_ENDPOINT** - Check `.env` file
   ```
   DYNAMODB_ENDPOINT=http://localhost:8000
   ```

---

### Backend port already in use

**Error:**
```
listen EADDRINUSE: address already in use :::3000
```

**Solutions:**

Option 1: Kill the process
```powershell
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

Option 2: Use a different port
```powershell
$env:PORT=3001
npm run dev
```

---

### Backend not reloading on file changes

**Issue:** Changes to code don't reflect without restart

**Solution:** Ensure nodemon is installed and working
```powershell
cd backend
npm install --save-dev nodemon

# Check it's in scripts
cat package.json | findstr "dev"

# Should show: "dev": "nodemon --exec ts-node src/server.ts"
```

---

## Frontend Issues

### Frontend won't start - "Port 5173 already in use"

**Error:**
```
error: port 5173 is in use. trying another one...
Vite is starting up. This is taking longer than expected. It may be hung.
```

**Solutions:**

Option 1: Use a different port
```powershell
cd frontend
npm run dev -- --port 5174
```

Option 2: Kill the process using port 5173
```powershell
netstat -ano | findstr :5173
taskkill /PID <PID> /F
```

---

### Frontend fails to compile - TypeScript errors

**Error:**
```
error TS7006: Parameter 'x' implicitly has an 'any' type
```

**Solution:** Fix TypeScript errors in the code

```powershell
# Check for all errors
cd frontend
npm run build

# The output will show line numbers and filenames
# Fix the errors in the source files
```

---

### Vite hot reload not working

**Issue:** Changes to frontend code don't reflect automatically

**Solutions:**

Option 1: Check Vite config
- Verify `frontend/vite.config.ts` exists
- Check `hmr` settings if behind proxy

Option 2: Restart dev server
```powershell
# Press Ctrl+C in frontend terminal
# Run again
npm run dev
```

Option 3: Hard refresh browser
```
Ctrl+Shift+R (Windows/Linux)
Cmd+Shift+R (Mac)
```

---

## API & Connectivity Issues

### Frontend can't connect to backend API

**Error in browser console:**
```
GET http://localhost:5173/api/bots 404 (Not Found)
```

**Causes & Solutions:**

1. **Backend not running** - Start backend
   ```powershell
   cd backend
   npm run dev
   ```

2. **API proxy not working** - Check frontend config
   ```powershell
   # Check frontend/vite.config.ts has:
   proxy: {
     '/api': {
       target: 'http://localhost:3000',
       changeOrigin: true,
     },
   }
   ```

3. **Wrong environment variable** - Check frontend/.env
   ```
   VITE_API_URL=/api
   ```

4. **CORS error** - Check backend CORS settings
   ```
   Access to XMLHttpRequest blocked by CORS policy
   ```
   Solution: Verify Express app has CORS middleware

---

### 404 errors from API endpoints

**Error:**
```
GET /api/bots 404 Not Found
```

**Causes:**

1. **Backend not running** - Start backend
2. **Wrong API path** - Check route definitions in `backend/src/routes/`
3. **Routes not mounted** - Check `backend/src/app.ts` has route mounting

---

### 500 Internal Server Error

**Error:**
```
POST /api/bots 500 Internal Server Error
```

**Debugging:**

1. Check backend console for error message
2. Check DynamoDB is running and responding
3. Check request body format matches expected schema
4. Check data/tables exist in DynamoDB

---

### CORS errors

**Error:**
```
Access to XMLHttpRequest at 'http://localhost:3000/api/bots' blocked by CORS policy
```

**Solution:** Backend needs CORS enabled
```typescript
// backend/src/app.ts should have:
import cors from 'cors';
app.use(cors());
```

---

## Seeding Issues

### Seeding fails with "Cannot connect to API"

**Error:**
```
Error: fetch failed
Caused by: Error: connect ECONNREFUSED 127.0.0.1:3000
```

**Solution:** Ensure backend is running
```powershell
cd backend
npm run dev

# In another terminal:
npm run seed:database
```

---

### Seeding fails with "ENOTFOUND dynamodb"

**Error:**
```
Error: getaddrinfo ENOTFOUND dynamodb
```

**Solution:** This happens when backend was started but can't reach DynamoDB

1. Verify DynamoDB is running
   ```powershell
   docker ps | findstr dynamodb
   ```

2. Restart DynamoDB and backend
   ```powershell
   docker-compose down -v
   docker-compose up -d dynamodb
   Start-Sleep -Seconds 5
   cd backend && npm run dev
   ```

---

### Some seeding batches fail

**Error:**
```
⚠️  Failed to post 04140c19-0c46-43c6-8e78-f459cd3b3370: HTTP 400: ...
```

**Cause:** Usually indicates malformed data or database constraint issues

**Solutions:**

1. Check data file format - ensure valid JSON
2. Run seeding again - may be temporary issue
3. Clear database and retry
   ```powershell
   docker-compose down -v
   docker-compose up -d dynamodb
   npm run seed:database
   ```

---

### Seeding timeout

**Error:**
```
Error: The operation timed out
```

**Solution:** Increase batch delay or reduce batch size

Edit `scripts/seed-database.mjs`:
```javascript
const BATCH_SIZE = 5;  // Reduce from 10
const BATCH_DELAY_MS = 1000;  // Increase from 500
```

---

## Performance Issues

### Slow API responses

**Debugging:**

1. Check backend logs for slow queries
2. Verify DynamoDB is responding quickly
3. Check network latency
   ```powershell
   curl -w "@curl-format.txt" http://localhost:3000/api/bots
   ```

4. Check browser Network tab in DevTools

---

### Frontend sluggish/high CPU usage

**Solutions:**

1. Check React DevTools for unnecessary re-renders
2. Look for memory leaks in browser console
3. Restart dev server
4. Check for large bundle size
   ```powershell
   cd frontend
   npm run build
   npm run preview
   ```

---

### Database slow with large datasets

**Solutions:**

1. Add pagination limits (already done, max 100)
2. Add indexes to DynamoDB tables
3. Implement caching in backend
4. Consider query optimization

---

## Getting More Help

### Check Logs

1. **Backend logs** - Terminal where backend is running
2. **Frontend console** - Browser DevTools (F12)
3. **Docker logs** - `docker logs bot-admin-dynamodb`
4. **DynamoDB logs** - Container logs or local file

### Test Connectivity

```powershell
# Test DynamoDB
curl http://localhost:8000/

# Test Backend health
curl http://localhost:3000/health

# Test API endpoint
curl http://localhost:3000/api/bots
```

### Reset Everything

```powershell
# Stop all containers
docker-compose down -v

# Clear node_modules if needed
rm -r backend/node_modules frontend/node_modules
npm install

# Restart fresh
docker-compose up -d dynamodb
cd backend && npm run dev
```

---

## Still Having Issues?

1. Check the specific guide for your operating system
2. Review error messages carefully - they often contain solutions
3. Check application logs and browser console
4. Try the "Reset Everything" steps above
5. Check GitHub issues or documentation
