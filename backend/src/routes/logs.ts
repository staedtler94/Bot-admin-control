import { Router, Request, Response, NextFunction } from 'express';
import { LogService } from '../services/LogService';

const router = Router({ mergeParams: true });

// GET /api/logs/bot/:botId - Get logs for a specific bot
router.get('/bot/:botId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const limit = Math.min(parseInt(req.query.limit as string) || 20, 100);
    const messageSearch = req.query.search as string | undefined;

    const filter = {
      bot: req.params.botId,
      messageSearch,
      limit,
    };

    const result = await LogService.getLogsWithFilter(filter);

    res.json({
      success: true,
      data: result.items,
      pagination: {
        limit,
        total: result.count,
      },
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/logs/worker/:workerId - Get logs for a specific worker (requires botId in query)
router.get('/worker/:workerId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const botId = req.query.botId as string || req.params.botId;
    if (!botId) {
      return res.status(400).json({
        success: false,
        error: 'Bot ID is required',
      });
    }

    const limit = Math.min(parseInt(req.query.limit as string) || 20, 100);

    const result = await LogService.getLogsByWorkerId(botId, req.params.workerId, limit);

    res.json({
      success: true,
      data: result.items,
      pagination: {
        limit,
        total: result.count,
      },
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/logs - Create a new log
router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const log = await LogService.createLog(req.body);

    res.status(201).json({
      success: true,
      data: log,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
