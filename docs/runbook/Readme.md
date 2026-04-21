# Bot Admin Control - Runbook

## Table of Contents

Welcome to the Bot Admin Control runbook. This guide provides detailed procedures for operating the Bot Admin Control system.

### 📋 Runbook Index

| Document | Purpose |
|----------|---------|
| **[Setup & Installation](./setup.md)** | Complete setup instructions for the application |
| **[Database Seeding Guide](./seeding.md)** | How to seed the database with initial data |
| **[Running the Application](./running-app.md)** | Step-by-step guide to run the application |
| **[Troubleshooting](./troubleshooting.md)** | Common issues and solutions |

---

## Quick Start

### Prerequisites
- Docker & Docker Compose
- Node.js 18+
- npm

### One-Command Setup
```bash
# 1. Start DynamoDB
docker-compose up -d dynamodb

# 2. Install dependencies
cd backend && npm install
cd ../frontend && npm install

# 3. In separate terminals, start the services
# Terminal 1 - Backend
cd backend && npm run dev

# Terminal 2 - Frontend  
cd frontend && npm run dev

# Terminal 3 - Seed the database (after backend is running)
npm run seed:database
```

Then access the application at **http://localhost:5173**

---

## Available Commands

**Root Level:**
- `npm start` - Generate mock data
- `npm run docker:dynamodb` - Start only DynamoDB container
- `npm run seed:database` - Seed the database with data

**Backend:**
- `npm run dev` - Start backend development server
- `npm run build` - Build backend
- `npm test` - Run tests (if configured)

**Frontend:**
- `npm run dev` - Start frontend development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

---

## Architecture Overview

```
┌─────────────┐
│  Frontend   │ (React/Vite) :5173
└──────┬──────┘
       │ (proxied to /api)
┌──────▼──────┐
│  Backend    │ (Express/Node) :3000
└──────┬──────┘
       │
┌──────▼──────┐
│  DynamoDB   │ (Local) :8000
└─────────────┘
```

- **Frontend** → Proxies API calls through Vite dev server
- **Backend** → Express.js API server
- **DynamoDB** → Local database via Docker

---

## Support

For detailed instructions on each operation, please refer to the individual runbook documents listed in the Table of Contents above.

