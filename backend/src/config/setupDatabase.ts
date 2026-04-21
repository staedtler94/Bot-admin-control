import fs from 'fs';
import path from 'path';
import { DynamoDBClient, CreateTableCommand, ListTablesCommand } from '@aws-sdk/client-dynamodb';

const client = new DynamoDBClient({
  endpoint: process.env.DYNAMODB_ENDPOINT || 'http://localhost:8000',
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || 'local',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || 'local',
  },
});

const TABLES = [
  {
    TableName: 'bots',
    KeySchema: [{ AttributeName: 'id', KeyType: 'HASH' }],
    AttributeDefinitions: [{ AttributeName: 'id', AttributeType: 'S' }],
    BillingMode: 'PAY_PER_REQUEST',
  },
  {
    TableName: 'workers',
    KeySchema: [{ AttributeName: 'id', KeyType: 'HASH' }],
    AttributeDefinitions: [
      { AttributeName: 'id', AttributeType: 'S' },
      { AttributeName: 'bot', AttributeType: 'S' },
    ],
    GlobalSecondaryIndexes: [
      {
        IndexName: 'bot-index',
        KeySchema: [{ AttributeName: 'bot', KeyType: 'HASH' }],
        Projection: { ProjectionType: 'ALL' },
      },
    ],
    BillingMode: 'PAY_PER_REQUEST',
  },
  {
    TableName: 'logs',
    KeySchema: [{ AttributeName: 'id', KeyType: 'HASH' }],
    AttributeDefinitions: [
      { AttributeName: 'id', AttributeType: 'S' },
      { AttributeName: 'bot', AttributeType: 'S' },
      { AttributeName: 'worker', AttributeType: 'S' },
    ],
    GlobalSecondaryIndexes: [
      {
        IndexName: 'bot-index',
        KeySchema: [{ AttributeName: 'bot', KeyType: 'HASH' }],
        Projection: { ProjectionType: 'ALL' },
      },
      {
        IndexName: 'worker-index',
        KeySchema: [{ AttributeName: 'worker', KeyType: 'HASH' }],
        Projection: { ProjectionType: 'ALL' },
      },
    ],
    BillingMode: 'PAY_PER_REQUEST',
  },
];

async function createTables() {
  try {
    const listResult = await client.send(new ListTablesCommand({}));
    const existingTables = listResult.TableNames || [];

    for (const table of TABLES) {
      if (!existingTables.includes(table.TableName)) {
        console.log(`Creating table: ${table.TableName}`);
        await client.send(new CreateTableCommand(table as any));
        console.log(`✓ Table ${table.TableName} created successfully`);
      } else {
        console.log(`✓ Table ${table.TableName} already exists`);
      }
    }

    console.log('✓ All tables ready');
  } catch (error) {
    console.error('Error creating tables:', error);
    process.exit(1);
  }
}

// Load data from JSON files
async function loadInitialData() {
  try {
    const { getDynamoDBClient } = await import('./database');
    const documentClient = getDynamoDBClient();
    const { PutCommand } = await import('@aws-sdk/lib-dynamodb');

    const dataDir = path.join(process.cwd(), 'data');

    // Load bots
    const botsPath = path.join(dataDir, 'bots.json');
    if (fs.existsSync(botsPath)) {
      const bots = JSON.parse(fs.readFileSync(botsPath, 'utf-8'));
      for (const bot of bots) {
        await documentClient.send(new PutCommand({ TableName: 'bots', Item: bot }));
      }
      console.log(`✓ Loaded ${bots.length} bots`);
    }

    // Load workers
    const workersPath = path.join(dataDir, 'workers.json');
    if (fs.existsSync(workersPath)) {
      const workers = JSON.parse(fs.readFileSync(workersPath, 'utf-8'));
      for (const worker of workers) {
        await documentClient.send(new PutCommand({ TableName: 'workers', Item: worker }));
      }
      console.log(`✓ Loaded ${workers.length} workers`);
    }

    // Load logs
    const logsPath = path.join(dataDir, 'logs.json');
    if (fs.existsSync(logsPath)) {
      const logs = JSON.parse(fs.readFileSync(logsPath, 'utf-8'));
      for (const log of logs) {
        await documentClient.send(new PutCommand({ TableName: 'logs', Item: log }));
      }
      console.log(`✓ Loaded ${logs.length} logs`);
    }
  } catch (error) {
    console.error('Error loading initial data:', error);
  }
}

export async function setupDatabase() {
  console.log('Setting up DynamoDB...');
  await createTables();
  await loadInitialData();
}
