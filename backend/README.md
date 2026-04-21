# Backend - Bot Admin Control API

RESTful API backend for Bot Admin Control built with Node.js, Express, TypeScript, and DynamoDB.

## Quick Start

### Prerequisites
- Node.js 20+
- npm/yarn
- DynamoDB Local (optional, for local development)

### Installation

```bash
cd backend
npm install
```

### Environment Setup

Create a `.env` file:
```env
PORT=3000
NODE_ENV=development
API_PREFIX=/api
DYNAMODB_ENDPOINT=http://localhost:8000
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=local
AWS_SECRET_ACCESS_KEY=local
```

### Development

Start DynamoDB Local (in a separate terminal):
```bash
docker run -p 8000:8000 amazon/dynamodb-local
```

Start the development server:
```bash
npm run dev
```

Server runs at `http://localhost:3000`

### Build & Production

Build TypeScript:
```bash
npm run build
```

Start production server:
```bash
npm start
```

## API Endpoints

### Bots
- `GET /api/bots` - List all bots (paginated)
- `GET /api/bots/:botId` - Get bot details
- `POST /api/bots` - Create bot
- `PUT /api/bots/:botId` - Update bot
- `DELETE /api/bots/:botId` - Delete bot

### Workers
- `GET /api/workers` - List all workers
- `GET /api/workers/:workerId` - Get worker details
- `GET /api/workers/bot/:botId` - Get workers for a bot
- `POST /api/workers` - Create worker
- `PUT /api/workers/:workerId` - Update worker
- `DELETE /api/workers/:workerId` - Delete worker

### Logs
- `GET /api/logs/bot/:botId` - Get logs for a bot
- `GET /api/logs/worker/:workerId` - Get logs for a worker
- `POST /api/logs` - Create log

### System
- `GET /api/health` - Health check

## Architecture

### Layered Design
1. **Routes**: HTTP endpoint handlers
2. **Services**: Business logic and validation
3. **Repositories**: Database queries
4. **Models**: TypeScript interfaces

### Error Handling
- 400: Bad request / validation error
- 404: Resource not found
- 500: Server error

All errors are caught and formatted consistently.

## Database

### Tables
- **bots**: Primary key `id`
- **workers**: Primary key `id`, GSI on `bot`
- **logs**: Primary key `id`, GSI on `bot` and `worker`

### Data Seeding
Database tables and initial data are created automatically on startup.

## Code Quality

### Linting
```bash
npm run lint
```

### Formatting
```bash
npm run format
```

### TypeScript
Strict mode enabled. Compile and check types:
```bash
npm run build
```

## Monitoring

Health check endpoint:
```bash
curl http://localhost:3000/health
```

Request logging middleware logs all requests:
```
[2024-04-20T10:30:15.123Z] GET /api/bots - 200 (45ms)
```

## Docker

Build Docker image:
```bash
docker build -t bot-admin-backend .
```

Run in Docker:
```bash
docker run -p 3000:3000 \
  -e DYNAMODB_ENDPOINT=http://host.docker.internal:8000 \
  bot-admin-backend
```

## Dependencies

- **express**: Web framework
- **@aws-sdk/***: DynamoDB client
- **cors**: Cross-origin requests
- **uuid**: ID generation
- **zod**: Data validation
- **winston**: Logging
- **dotenv**: Environment variables

## Development Dependencies

- **typescript**: Type safety
- **ts-node**: TypeScript execution
- **nodemon**: Auto-reload on file changes
- **eslint**: Linting
- **prettier**: Code formatting

---

For detailed architecture, see [ARCHITECTURE.md](../design/ARCHITECTURE.md)
