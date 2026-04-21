import { Router, Request, Response, NextFunction } from 'express';
import { WorkerService } from '../services/WorkerService';

const router = Router();

// GET /api/workers - List all workers
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const limit = Math.min(parseInt(req.query.limit as string) || 20, 100);
    const offset = parseInt(req.query.offset as string) || 0;

    const result = await WorkerService.getAllWorkers(limit, offset);

    res.json({
      success: true,
      data: result.items,
      pagination: {
        limit,
        offset,
        total: result.count,
      },
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/workers/:id - Get worker details
router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const worker = await WorkerService.getWorkerById(req.params.id);

    res.json({
      success: true,
      data: worker,
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/workers - Create a new worker
router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const worker = await WorkerService.createWorker(req.body);

    res.status(201).json({
      success: true,
      data: worker,
    });
  } catch (error) {
    next(error);
  }
});

// PUT /api/workers/:id - Update a worker
router.put('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const worker = await WorkerService.updateWorker(req.params.id, req.body);

    res.json({
      success: true,
      data: worker,
    });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/workers/:id - Delete a worker
router.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    await WorkerService.deleteWorker(req.params.id);

    res.json({
      success: true,
      message: 'Worker deleted successfully',
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/workers/bot/:botId - Get workers for a specific bot
router.get('/bot/:botId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const limit = Math.min(parseInt(req.query.limit as string) || 20, 100);
    const result = await WorkerService.getWorkersByBotId(req.params.botId, limit);

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

export default router;
