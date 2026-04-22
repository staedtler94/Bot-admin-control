import request from 'supertest';
import { createApp } from '../../src/app';
import { BotService } from '../../src/services/BotService';
import { makeBot } from '../fixtures';

jest.mock('../../src/services/BotService');

const mockedService = BotService as jest.Mocked<typeof BotService>;

describe('Bots routes', () => {
  const app = createApp();

  describe('GET /api/bots', () => {
    it('returns paginated bots', async () => {
      mockedService.getAllBots.mockResolvedValue({ items: [makeBot()], count: 1 });

      const res = await request(app).get('/api/bots');

      expect(res.status).toBe(200);
      expect(mockedService.getAllBots).toHaveBeenCalledWith(20, 0);
      expect(res.body).toMatchSnapshot();
    });

    it('clamps limit > 100 to 100', async () => {
      mockedService.getAllBots.mockResolvedValue({ items: [], count: 0 });

      await request(app).get('/api/bots?limit=500&offset=10');

      expect(mockedService.getAllBots).toHaveBeenCalledWith(100, 10);
    });

    it('propagates service errors through errorHandler', async () => {
      mockedService.getAllBots.mockRejectedValue(new Error('Invalid bot ID'));

      const res = await request(app).get('/api/bots');

      expect(res.status).toBe(400);
      expect(res.body).toMatchSnapshot();
    });
  });

  describe('GET /api/bots/:id', () => {
    it('returns a single bot', async () => {
      mockedService.getBotById.mockResolvedValue(makeBot());

      const res = await request(app).get('/api/bots/bot-1');

      expect(res.status).toBe(200);
      expect(res.body).toMatchSnapshot();
    });

    it('returns 400 when service reports not found', async () => {
      mockedService.getBotById.mockRejectedValue(new Error('Bot with ID x not found'));

      const res = await request(app).get('/api/bots/x');

      expect(res.status).toBe(400);
      expect(res.body).toMatchSnapshot();
    });
  });

  describe('POST /api/bots', () => {
    it('creates a bot and returns 201', async () => {
      mockedService.createBot.mockResolvedValue(makeBot());

      const res = await request(app)
        .post('/api/bots')
        .send({ name: 'New Bot' });

      expect(res.status).toBe(201);
      expect(mockedService.createBot).toHaveBeenCalledWith({ name: 'New Bot' });
      expect(res.body).toMatchSnapshot();
    });

    it('returns 400 for validation errors recognised by the error handler', async () => {
      mockedService.createBot.mockRejectedValue(
        new Error('Invalid bot status. Must be one of: DISABLED, ENABLED, PAUSED')
      );

      const res = await request(app)
        .post('/api/bots')
        .send({ name: 'x', status: 'BROKEN' });

      expect(res.status).toBe(400);
      expect(res.body).toMatchSnapshot();
    });

    it('returns 500 for errors the error handler does not classify', async () => {
      mockedService.createBot.mockRejectedValue(new Error('db exploded'));

      const res = await request(app).post('/api/bots').send({ name: 'x' });

      expect(res.status).toBe(500);
      expect(res.body).toMatchSnapshot();
    });
  });

  describe('PUT /api/bots/:id', () => {
    it('updates a bot', async () => {
      mockedService.updateBot.mockResolvedValue(makeBot({ name: 'Renamed' }));

      const res = await request(app)
        .put('/api/bots/bot-1')
        .send({ name: 'Renamed' });

      expect(res.status).toBe(200);
      expect(res.body).toMatchSnapshot();
    });
  });

  describe('DELETE /api/bots/:id', () => {
    it('deletes a bot', async () => {
      mockedService.deleteBot.mockResolvedValue(undefined);

      const res = await request(app).delete('/api/bots/bot-1');

      expect(res.status).toBe(200);
      expect(res.body).toMatchSnapshot();
    });
  });
});
