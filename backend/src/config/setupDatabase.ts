import { CreateTableCommand, ListTablesCommand, type CreateTableCommandInput } from '@aws-sdk/client-dynamodb';
import { getDynamoDBClient } from './database';


const TABLES = [
  {
    TableName: 'bot-admin',
    KeySchema: [
      { AttributeName: 'pk', KeyType: 'HASH' },
      { AttributeName: 'sk', KeyType: 'RANGE' },
    ],
    AttributeDefinitions: [
      { AttributeName: 'pk', AttributeType: 'S' },
      { AttributeName: 'sk', AttributeType: 'S' },
    ],
    BillingMode: 'PAY_PER_REQUEST',
  },
];

async function createTables() {
  try {
    const client = getDynamoDBClient();
    const listResult = await client.send(new ListTablesCommand({}));
    const existingTables = listResult.TableNames || [];

    for (const table of TABLES) {
      if (!existingTables.includes(table.TableName)) {
        console.log(`Creating table: ${table.TableName}`);
        await client.send(new CreateTableCommand(table as CreateTableCommandInput));
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
// async function loadInitialData() {
//   try {

//     const documentClient = getDynamoDBClient();


//     const dataDir = path.join(process.cwd(), 'data');

//     // Load bots
//     const botsPath = path.join(dataDir, 'bots.json');
//     if (fs.existsSync(botsPath)) {
//       const bots = JSON.parse(fs.readFileSync(botsPath, 'utf-8'));
//       for (const bot of bots) {
//         await documentClient.send(new PutCommand({ 
//           TableName: 'bot-admin', 
//           Item: {
//             ...bot,
//             pk: 'Bot',
//             sk: bot.id,
//           }
//         }));
//       }
//       console.log(`✓ Loaded ${bots.length} bots`);
//     }

//     // Load workers
//     const workersPath = path.join(dataDir, 'workers.json');
//     if (fs.existsSync(workersPath)) {
//       const workers = JSON.parse(fs.readFileSync(workersPath, 'utf-8'));
//       for (const worker of workers) {
//         await documentClient.send(new PutCommand({ 
//           TableName: 'bot-admin', 
//           Item: {
//             ...worker,
//             pk: 'Worker',
//             sk: `${worker.bot}#${worker.id}`,
//           }
//         }));
//       }
//       console.log(`✓ Loaded ${workers.length} workers`);
//     }

//     // Load logs
//     const logsPath = path.join(dataDir, 'logs.json');
//     if (fs.existsSync(logsPath)) {
//       const logs = JSON.parse(fs.readFileSync(logsPath, 'utf-8'));
//       for (const log of logs) {
//         await documentClient.send(new PutCommand({ 
//           TableName: 'bot-admin', 
//           Item: {
//             ...log,
//             pk: `Log#${log.bot}`,
//             sk: `${log.worker}#${log.id}`,
//           }
//         }));
//       }
//       console.log(`✓ Loaded ${logs.length} logs`);
//     }
//   } catch (error) {
//     console.error('Error loading initial data:', error);
//   }
// }

export async function setupDatabase() {
  console.log('Setting up DynamoDB...');
  await createTables();
  // await loadInitialData();
}
