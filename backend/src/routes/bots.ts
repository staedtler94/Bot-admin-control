import { Router, Request, Response, NextFunction } from 'express';
import { BotService } from '../services/BotService';

const router = Router();

// GET /api/bots - List all bots
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const limit = Math.min(parseInt(req.query.limit as string) || 20, 100);
    const offset = parseInt(req.query.offset as string) || 0;

    const result = await BotService.getAllBots(limit, offset);

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

// GET /api/bots/:id - Get bot details
router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const bot = await BotService.getBotById(req.params.id);

    res.json({
      success: true,
      data: bot,
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/bots - Create a new bot
router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const bot = await BotService.createBot(req.body);

    res.status(201).json({
      success: true,
      data: bot,
    });
  } catch (error) {
    next(error);
  }
});

// PUT /api/bots/:id - Update a bot
router.put('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const bot = await BotService.updateBot(req.params.id, req.body);

    res.json({
      success: true,
      data: bot,
    });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/bots/:id - Delete a bot
router.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    await BotService.deleteBot(req.params.id);

    res.json({
      success: true,
      message: 'Bot deleted successfully',
    });
  } catch (error) {
    next(error);
  }
});

export default router;
