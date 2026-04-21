import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const API_BASE_URL = process.env.API_URL || 'http://localhost:3000/api';
const BATCH_SIZE = 10;
const BATCH_DELAY_MS = 500; // Delay between batches to avoid throttling

// ANSI color codes for logging
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

/**
 * Log with colored output
 */
function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

/**
 * Read JSON data file
 */
function readDataFile(filename) {
  const filepath = path.join(__dirname, '..', 'data', filename);
  try {
    const data = fs.readFileSync(filepath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    log(`❌ Error reading ${filename}: ${error.message}`, 'yellow');
    return [];
  }
}

/**
 * Process items in batches
 */
async function processBatch(items, endpoint, batchNum, totalBatches) {
  const successIds = [];
  const failedIds = [];

  for (const item of items) {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(item),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`HTTP ${response.status}: ${errorData.message || 'Unknown error'}`);
      }

      successIds.push(item.id);
    } catch (error) {
      log(`  ⚠️  Failed to post ${item.id}: ${error.message}`, 'yellow');
      failedIds.push(item.id);
    }
  }

  log(
    `  ✅ Batch ${batchNum}/${totalBatches} completed: ${successIds.length} successful, ${failedIds.length} failed`,
    'green'
  );

  if (successIds.length > 0) {
    log(`     IDs: ${successIds.join(', ')}`, 'cyan');
  }

  return { successIds, failedIds };
}

/**
 * Split array into chunks
 */
function chunk(array, size) {
  const chunks = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}

/**
 * Map worker bot reference from name to ID
 */
function mapWorkerBotReference(workers, botMap) {
  return workers.map((worker) => {
    // If bot is still a name string, try to map it to an ID
    if (botMap[worker.bot]) {
      return { ...worker, bot: botMap[worker.bot] };
    }
    return worker;
  });
}

/**
 * Main seeding function
 */
async function seedDatabase() {
  log('\n🚀 Starting database seeding...', 'bright');
  log(`📍 API Base URL: ${API_BASE_URL}`, 'blue');
  log(`⏱️  Batch Size: ${BATCH_SIZE} items`);
  log(`⏳ Batch Delay: ${BATCH_DELAY_MS}ms\n`, 'blue');

  let totalSuccess = 0;
  let totalFailed = 0;
  const botMap = {}; // Map bot names to IDs for worker references

  // ========== SEED BOTS ==========
  log('📦 Seeding Bots...', 'bright');
  let bots = readDataFile('bots.json');

  if (bots.length === 0) {
    log('⚠️  No bots to seed', 'yellow');
  } else {
    const botBatches = chunk(bots, BATCH_SIZE);
    const totalBatches = botBatches.length;

    for (let i = 0; i < botBatches.length; i++) {
      const { successIds, failedIds } = await processBatch(
        botBatches[i],
        '/bots',
        i + 1,
        totalBatches
      );

      // Map bot names to IDs for workers
      botBatches[i].forEach((bot, idx) => {
        if (successIds.includes(bot.id)) {
          botMap[bot.name] = bot.id;
        }
      });

      totalSuccess += successIds.length;
      totalFailed += failedIds.length;

      if (i < botBatches.length - 1) {
        await new Promise((resolve) => setTimeout(resolve, BATCH_DELAY_MS));
      }
    }
  }

  log(`\n✅ Bots seeding complete: ${totalSuccess} successful, ${totalFailed} failed\n`, 'green');

  // ========== SEED WORKERS ==========
  log('👷 Seeding Workers...', 'bright');
  let workers = readDataFile('workers.json');

  if (workers.length === 0) {
    log('⚠️  No workers to seed', 'yellow');
  } else {
    // Map worker bot references from names to IDs
    workers = mapWorkerBotReference(workers, botMap);

    const workerBatches = chunk(workers, BATCH_SIZE);
    const totalBatches = workerBatches.length;
    let workerSuccess = 0;
    let workerFailed = 0;

    for (let i = 0; i < workerBatches.length; i++) {
      const { successIds, failedIds } = await processBatch(
        workerBatches[i],
        '/workers',
        i + 1,
        totalBatches
      );

      workerSuccess += successIds.length;
      workerFailed += failedIds.length;

      if (i < workerBatches.length - 1) {
        await new Promise((resolve) => setTimeout(resolve, BATCH_DELAY_MS));
      }
    }

    totalSuccess += workerSuccess;
    totalFailed += workerFailed;

    log(
      `\n✅ Workers seeding complete: ${workerSuccess} successful, ${workerFailed} failed\n`,
      'green'
    );
  }

  // ========== SEED LOGS ==========
  setTimeout(() => log('⏳ Waiting 2 seconds before seeding logs to ensure bots and workers are created...', 'blue'), 2000);
  log('📝 Seeding Logs...', 'bright');
  let logs = readDataFile('logs.json');

  if (logs.length === 0) {
    log('⚠️  No logs to seed', 'yellow');
  } else {
    const logBatches = chunk(logs, BATCH_SIZE);
    const totalBatches = logBatches.length;
    let logSuccess = 0;
    let logFailed = 0;

    for (let i = 0; i < logBatches.length; i++) {
      const { successIds, failedIds } = await processBatch(
        logBatches[i],
        '/logs',
        i + 1,
        totalBatches
      );

      logSuccess += successIds.length;
      logFailed += failedIds.length;

      if (i < logBatches.length - 1) {
        await new Promise((resolve) => setTimeout(resolve, BATCH_DELAY_MS));
      }
    }

    totalSuccess += logSuccess;
    totalFailed += logFailed;

    log(`\n✅ Logs seeding complete: ${logSuccess} successful, ${logFailed} failed\n`, 'green');
  }

  // ========== SUMMARY ==========
  log('═'.repeat(50), 'bright');
  log('📊 SEEDING SUMMARY', 'bright');
  log('═'.repeat(50), 'bright');
  log(`Total Items Processed: ${totalSuccess + totalFailed}`, 'cyan');
  log(`✅ Successfully Posted: ${totalSuccess}`, 'green');
  log(`❌ Failed Items: ${totalFailed}`, totalFailed > 0 ? 'yellow' : 'green');
  log('═'.repeat(50) + '\n', 'bright');

  if (totalFailed === 0) {
    log('🎉 All data seeded successfully!', 'green');
  } else {
    log('⚠️  Some items failed to seed. Please check the logs above.', 'yellow');
  }
}

// Run seeding
seedDatabase().catch((error) => {
  log(`\n❌ Fatal error during seeding: ${error.message}`, 'yellow');
  process.exit(1);
});
