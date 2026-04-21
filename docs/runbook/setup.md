# Setup & Installation Guide

## Overview

This document covers the complete setup and installation process for the Bot Admin Control system.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Docker & Docker Compose** - For running DynamoDB
- **Node.js** - Version 18 or higher ([Download](https://nodejs.org/))
- **npm** - Comes with Node.js
- **Git** - For cloning the repository
- **PowerShell or Bash** - For running commands

### Verify Prerequisites

```powershell
# Check Docker
docker --version
docker-compose --version

# Check Node.js and npm
node --version
npm --version
```

---

## Installation Steps

### 1. Clone or Extract the Repository

```powershell
cd path/to/Bot-admin-control
```

### 2. Install Dependencies

Install npm packages for all services:

```powershell
# Install root dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..

# Install frontend dependencies
cd frontend
npm install
cd ..
```

### 3. Configure Environment Variables

#### Backend (.env)

The backend already has a `.env` file configured. Verify these settings:

```
NODE_ENV=development
PORT=3000
DYNAMODB_ENDPOINT=http://localhost:8000
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=local
AWS_SECRET_ACCESS_KEY=local
```

#### Frontend (.env)

The frontend is configured to use relative paths:

```
VITE_API_URL=/api
```

### 4. Start DynamoDB

In a terminal, start the local DynamoDB container:

```powershell
docker-compose up -d dynamodb
```

Verify DynamoDB is running:

```powershell
# Check container status
docker ps | findstr dynamodb

# Test DynamoDB connection
curl http://localhost:8000/
```

Expected response: `{}`

---

## Startup Verification

After following the installation steps, you should have:

- ✅ All npm packages installed
- ✅ Environment variables configured
- ✅ DynamoDB container running and accessible
- ✅ All services ready to start

For next steps, see **[Running the Application](./running-app.md)**.

---

## Troubleshooting Setup Issues

### Issue: Docker command not found
**Solution:** Ensure Docker is installed and in your PATH. Restart your terminal or computer.

### Issue: Node/npm not found
**Solution:** Ensure Node.js is installed. Restart your terminal or add Node.js to your PATH.

### Issue: npm install fails
**Solution:** 
```powershell
# Clear npm cache
npm cache clean --force

# Delete node_modules and try again
rm -r node_modules package-lock.json
npm install
```

### Issue: Port 8000 already in use
**Solution:**
```powershell
# Find and kill the process using port 8000
netstat -ano | findstr :8000
taskkill /PID <PID> /F

# Or use a different port:
docker-compose run -p 8001:8000 dynamodb
```

For more issues, see the **[Troubleshooting Guide](./troubleshooting.md)**.
