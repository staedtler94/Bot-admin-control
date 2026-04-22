# Bot Admin Control - Full Stack Application

A modern full-stack application for managing bots, workers, and logs built with Node.js/Express (backend) and React (frontend).

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    Presentation Layer                        │
│        React + TypeScript + Tailwind CSS Frontend           │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐      │
│  │ BotList  │ │BotDetail │ │  Logs    │ │ Workers  │      │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘      │
└─────────────────────────────────────────────────────────────┘
                           ↓ HTTP (REST)
┌─────────────────────────────────────────────────────────────┐
│                    API Layer                                  │
│   Node.js + Express + TypeScript Backend                    │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐      │
│  │  Routes  │ │ Services │ │Repos     │ │Middleware│      │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘      │
└─────────────────────────────────────────────────────────────┘
                           ↓ Query
┌─────────────────────────────────────────────────────────────┐
│                    Database Layer                             │
│        Amazon DynamoDB Local (Development)                  │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐                       │
│  │  bots   │ │ workers │ │  logs   │                       │
│  └─────────┘ └─────────┘ └─────────┘                       │
└─────────────────────────────────────────────────────────────┘
```

## Features

✅ **View List of Bots** - Display all bots with pagination  
✅ **View Bot Details** - See full bot information  
✅ **View Workers** - See all workers associated with a bot  
✅ **View Logs** - Access audit trail for bots and workers  
✅ **Responsive UI** - Works on desktop, tablet, and mobile  
✅ **Error Handling** - Graceful error messages  
✅ **Type Safety** - Full TypeScript implementation  

## Tech Stack

### Backend
- **Runtime**: Node.js 20
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: Amazon DynamoDB Local
- **Package Manager**: npm

### Frontend
- **Library**: React 18
- **Language**: TypeScript
- **Bundler**: Vite
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios

### DevOps
- **Containerization**: Docker
- **Orchestration**: Docker Compose

## Project Structure

```
Bot-admin-control/
├── backend/
│   ├── src/
│   │   ├── config/        # Database & constants
│   │   ├── models/        # TypeScript interfaces
│   │   ├── repositories/  # Data access layer
│   │   ├── services/      # Business logic
│   │   ├── routes/        # API endpoints
│   │   ├── middleware/    # Express middleware
│   │   └── utils/         # Utilities
│   ├── package.json
│   ├── tsconfig.json
│   ├── Dockerfile
│   └── README.md
│
├── frontend/
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── services/      # API client
│   │   ├── types/         # TypeScript types
│   │   ├── utils/         # Utilities
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── index.html
│   ├── package.json
│   ├── tsconfig.json
│   ├── Dockerfile
│   └── README.md
│
├── docs/
│   ├── design/
│   │   ├── ARCHITECTURE.md
│   │   └── api/openapi.yaml
│   ├── playbook/              # Team workflows, quality gates, releases
│   │   ├── Readme.md
│   │   ├── development-workflow.md
│   │   ├── testing-and-quality.md
│   │   ├── releases-and-deployments.md
│   │   └── incident-response.md
│   └── runbook/               # Install, run, seed, operate, troubleshoot
│       ├── Readme.md
│       ├── setup.md
│       ├── running-app.md
│       ├── seeding.md
│       ├── operations.md
│       └── troubleshooting.md
│
├── data/
│   ├── bots.json
│   ├── workers.json
│   └── logs.json
│
├── docker-compose.yml
└── README.md (this file)
```

## Quick Start

### Local Development

**First-time setup (install + instructions for multiple terminals):**

```bash
npm install
npm run setup
```

That runs `npm install` in the repo root, `backend/`, and `frontend/`, then prints the recommended order: DynamoDB → backend → seed → frontend. For the printed steps only: `npm run setup:help`. See also [Runbook: Quick start](./docs/runbook/Readme.md).

#### Backend Setup
```bash
cd backend
npm install
npm run dev
```

Backend runs at `http://localhost:3000`

#### Start DynamoDB Local (separate terminal)
```bash
docker run -p 8000:8000 amazon/dynamodb-local
```

#### Frontend Setup (separate terminal)
```bash
cd frontend
npm install
npm run dev
```

Frontend runs at `http://localhost:5173`

## Usage

### Viewing Bots
1. Open the application
2. See the list of all bots on the home page
3. Click on any bot card to view details

### Viewing Bot Details
1. From the bot list, click on a bot
2. View bot information
3. Switch between "Workers" and "Logs" tabs

### Viewing Workers
1. Navigate to a bot detail page
2. Click on the "Workers" tab
3. See all workers associated with that bot

### Viewing Logs
1. Navigate to a bot detail page
2. Click on the "Logs" tab
3. View all logs for that bot (searchable)

## API Documentation

### Health Check
```bash
curl http://localhost:3000/api/health
```

### Get All Bots
```bash
curl http://localhost:3000/api/bots?limit=20&offset=0
```

### Get Bot Details
```bash
curl http://localhost:3000/api/bots/{botId}
```

### Get Workers for a Bot
```bash
curl http://localhost:3000/api/workers/bot/{botId}
```

### Get Logs for a Bot
```bash
curl http://localhost:3000/api/logs/bot/{botId}?search=error
```

See [ARCHITECTURE.md](./docs/design/ARCHITECTURE.md) for complete API reference.

## Development

### Running Tests

Backend:
```bash
cd backend
npm test
```

Frontend:
```bash
cd frontend
npm test
```

### Build for Production

Backend:
```bash
cd backend
npm run build
npm start
```

Frontend:
```bash
cd frontend
npm run build
npm preview
```

### Code Quality

Backend:
```bash
cd backend
npm run lint
npm run format
```

Frontend:
```bash
cd frontend
npm run lint
npm run format
```

## Database

### Table Schema

**Bots**
```json
{
  "id": "uuid",
  "name": "string",
  "description": "string (optional)",
  "status": "ENABLED|DISABLED|PAUSED",
  "created": "timestamp"
}
```

**Workers**
```json
{
  "id": "uuid",
  "name": "string",
  "description": "string (optional)",
  "bot": "bot-id",
  "created": "timestamp"
}
```

**Logs**
```json
{
  "id": "uuid",
  "created": "ISO timestamp",
  "message": "string",
  "bot": "bot-id",
  "worker": "worker-id"
}
```

## Error Handling

The application handles errors gracefully:
- **400**: Invalid input or validation error
- **404**: Resource not found
- **500**: Server error

All errors are logged and reported to the user with helpful messages.

## Performance Considerations

- **Pagination**: Limits data transfer for large datasets
- **Indexing**: DynamoDB indexes enable fast queries
- **Lazy Loading**: Components load data on demand
- **Caching**: Frontend caches data with React hooks

## Deployment

### Docker Build

Build Docker images:
```bash
docker build -t bot-admin-backend ./backend
docker build -t bot-admin-frontend ./frontend
```

### Docker Compose Production

For production, create a `.env.production` file and override the values:
```yaml
environment:
  - DYNAMODB_ENDPOINT=http://dynamodb-prod:8000
  - NODE_ENV=production
```

### AWS Deployment (Future)

- Deploy backend to AWS Lambda/EC2
- Deploy frontend to CloudFront/S3
- Use AWS DynamoDB instead of local
- Add RDS for relational data
- Setup Route53 for DNS

## Contributing

1. Create a feature branch
2. Make changes following the architecture
3. Test thoroughly
4. Format code with prettier
5. Commit with clear messages
6. Create pull request

## Troubleshooting

### Backend won't start
- Ensure DynamoDB Local is running on port 8000
- Check that port 3000 is available
- Verify .env variables are set correctly

### Frontend can't connect to backend
- Ensure backend is running on port 3000
- Check CORS configuration
- Verify API_URL in frontend .env

### Docker containers not communicating
- Ensure all containers are on the same network
- Check container names in docker-compose.yml
- Verify exposed ports

## Resources

- [Architecture Design Document](./docs/design/ARCHITECTURE.md)
- [Playbook](./docs/playbook/Readme.md) (development workflow, testing, releases)
- [Runbook](./docs/runbook/Readme.md) (setup, operations, troubleshooting)
- [Backend README](./backend/README.md)
- [Frontend README](./frontend/README.md)
- [DynamoDB Documentation](https://docs.aws.amazon.com/dynamodb/)
- [React Documentation](https://react.dev/)
- [Express Documentation](https://expressjs.com/)

## License

ISC

---

**Last Updated**: April 20, 2026  
**Version**: 1.0.0
