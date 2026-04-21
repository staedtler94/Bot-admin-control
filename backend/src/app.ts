import express, { Express } from 'express';
import cors from 'cors';
import { API_PREFIX, PORT } from './config/constants';
import { requestLogger } from './middleware/requestLogger';
import { errorHandler } from './middleware/errorHandler';
import healthRoutes from './routes/index';
import botRoutes from './routes/bots';
import workerRoutes from './routes/workers';
import logRoutes from './routes/logs';

export function createApp(): Express {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(requestLogger);

  // Health check
  app.use('/', healthRoutes);

  // API Routes
  app.use(`${API_PREFIX}/bots`, botRoutes);
  app.use(`${API_PREFIX}/workers`, workerRoutes);
  app.use(`${API_PREFIX}/logs`, logRoutes);

  // 404 handler
  app.use((req, res) => {
    res.status(404).json({
      success: false,
      error: {
        message: `Route ${req.method} ${req.path} not found`,
        statusCode: 404,
      },
    });
  });

  // Error handler (must be last)
  app.use(errorHandler);

  return app;
}
