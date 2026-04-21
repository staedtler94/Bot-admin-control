# Database Seeding Guide

## Overview

The seeding script populates your DynamoDB database with sample data from the `data/` folder. This includes bots, workers, and logs for testing and development.

---

## Data Structure

The seeding script reads three JSON files:

### 📦 Data Files

| File | Purpose | Records |
|------|---------|---------|
| `data/bots.json` | Bot definitions | Contains bot ID, name, status, etc. |
| `data/workers.json` | Worker definitions | Contains worker ID, assigned bot, etc. |
| `data/logs.json` | Log entries | Contains messages, bot, worker associations |

### Data Flow

```
Seed Script
    ↓
[1] POST /api/bots      → Creates all bots
    ↓
[2] POST /api/workers   → Creates all workers (linked to bots)
    ↓
[3] POST /api/logs      → Creates all log entries
```

---

## Prerequisites

Before running the seeding script:

1. ✅ DynamoDB is running (see [Setup Guide](./setup.md))
2. ✅ Backend server is running on port 3000
3. ✅ Data files exist in `data/` folder

---

## Running the Seeding Script

### Option 1: Using npm Script (Recommended)

```powershell
npm run seed:database
```

### Option 2: Direct Node Execution

```powershell
node scripts/seed-database.mjs
```

### Option 3: Custom API URL

If your backend is running on a different host/port:

```powershell
$env:API_URL="http://your-api:3000/api"; npm run seed:database
```

Or on Linux/Mac:

```bash
API_URL=http://your-api:3000/api npm run seed:database
```

---

## Script Features

### Batching

The script automatically batches requests in groups of **10** to avoid throttling:

```
Batch 1/3: Processing items 1-10...
  ✅ Batch 1/3 completed: 10 successful, 0 failed
  
Batch 2/3: Processing items 11-20...
  ✅ Batch 2/3 completed: 10 successful, 0 failed
```

### Delay Between Batches

Between each batch, a **500ms delay** is applied to prevent overwhelming the server.

### Logging

The script logs:
- ✅ Successfully created item IDs
- ⚠️ Any failed items with error reasons
- 📊 Summary statistics at the end

### Example Output

```
🚀 Starting database seeding...
📍 API Base URL: http://localhost:3000/api
⏱️  Batch Size: 10 items
⏳ Batch Delay: 500ms

📦 Seeding Bots...
  ✅ Batch 1/1 completed: 3 successful, 0 failed
     IDs: 04140c19-0c46-43c6-8e78-f459cd3b3370, 22526dec-4e04-4815-a641-ee6c71cbc5a9, 44700aa2-cba6-43d2-9ad4-8d8a499bd356

✅ Bots seeding complete: 3 successful, 0 failed

👷 Seeding Workers...
  ✅ Batch 1/2 completed: 10 successful, 0 failed
  ✅ Batch 2/2 completed: 5 successful, 0 failed

✅ Workers seeding complete: 15 successful, 0 failed

📝 Seeding Logs...
  ✅ Batch 1/5 completed: 10 successful, 0 failed
  ✅ Batch 2/5 completed: 10 successful, 0 failed
  ✅ Batch 3/5 completed: 10 successful, 0 failed
  ✅ Batch 4/5 completed: 10 successful, 0 failed
  ✅ Batch 5/5 completed: 8 successful, 0 failed

✅ Logs seeding complete: 48 successful, 0 failed

==================================================
📊 SEEDING SUMMARY
==================================================
Total Items Processed: 66
✅ Successfully Posted: 66
❌ Failed Items: 0
==================================================

🎉 All data seeded successfully!
```

---

## Complete Workflow

### Step 1: Start DynamoDB

```powershell
docker-compose up -d dynamodb
```

Wait for the container to be healthy (~10 seconds).

### Step 2: Start Backend

```powershell
cd backend
npm run dev
```

Wait for the message: `✅ Server is running on http://localhost:3000`

### Step 3: Run Seeding Script

In a new terminal:

```powershell
npm run seed:database
```

### Step 4: Verify Data

Using the API, verify data was created:

```powershell
# Check bots
curl http://localhost:3000/api/bots

# Check workers
curl http://localhost:3000/api/workers

# Check logs
curl http://localhost:3000/api/logs/bot/<botId>
```

---

## Clearing Database

To reset the database and seed fresh data:

```powershell
# Stop DynamoDB and remove volume
docker-compose down -v

# Start fresh
docker-compose up -d dynamodb

# Wait a few seconds for DynamoDB to initialize...
Start-Sleep -Seconds 3

# Seed again
npm run seed:database
```

---

## Handling Failures

### Common Issues

#### Issue: "Cannot connect to API"

```
Error: fetch failed
```

**Solution:** Ensure backend is running on port 3000
```powershell
cd backend && npm run dev
```

---

#### Issue: "ENOTFOUND dynamodb"

```
Error: getaddrinfo ENOTFOUND dynamodb
```

**Solution:** Backend cannot find DynamoDB. Ensure local DynamoDB is running:
```powershell
docker ps | findstr dynamodb
docker-compose up -d dynamodb
```

---

#### Issue: Partial seeding (some items failed)

The script will continue and report failed items. Check the logs for specific error messages.

```powershell
# To retry, run again:
npm run seed:database
```

---

## Modifying Seed Data

To seed different data:

1. Edit the JSON files in `data/` folder
2. Run the seeding script again

The script will post new records; it doesn't delete existing ones. To use fresh data, clear the database first (see "Clearing Database" section above).

---

## Next Steps

After seeding, you can:
- Start the frontend development server (see [Running the Application](./running-app.md))
- View the data in the web UI at http://localhost:5173
- Make API calls to test endpoints

For issues, check the **[Troubleshooting Guide](./troubleshooting.md)**.
