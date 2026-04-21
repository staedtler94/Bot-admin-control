import 'dotenv/config';
import { createApp } from './app';
import { initializeDynamoDB } from './config/database';
import { setupDatabase } from './config/setupDatabase';
import { PORT } from './config/constants';

async function startServer() {
  try {
    console.log('🚀 Starting Bot Admin Control API Server...');

    // Initialize DynamoDB
    console.log('📦 Initializing DynamoDB...');
    initializeDynamoDB();

    // Setup database (create tables & load data)
    console.log('📊 Setting up database...');
    await setupDatabase();

    // Create Express app
    const app = createApp();

    // Start server
    app.listen(PORT, () => {
      console.log(`✅ Server is running on http://localhost:${PORT}`);
      console.log(`📚 API docs: http://localhost:${PORT}/api`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
