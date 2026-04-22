import request from 'supertest';
import { createApp } from '../../src/app';
import { LogService } from '../../src/services/LogService';
import { makeLog } from '../fixtures';

jest.mock('../../src/services/LogService');

const mockedService = LogService as jest.Mocked<typeof LogService>;

describe('Logs routes', () => {
  const app = createApp();

  describe('GET /api/logs/bot/:botId', () => {
    it('returns filtered logs with pagination', async () => {
      mockedService.getLogsWithFilter.mockResolvedValue({
        items: [makeLog()],
        count: 1,
        total: 1,
      });

      const res = await request(app).get(
        '/api/logs/bot/bot-1?limit=5&offset=0&search=Hello'
      );

      expect(res.status).toBe(200);
      expect(mockedService.getLogsWithFilter).toHaveBeenCalledWith({
        bot: 'bot-1',
        messageSearch: 'Hello',
        limit: 5,
        offset: 0,
      });
      expect(res.body).toMatchSnapshot();
    });

    it('clamps excessive limit and negative offset', async () => {
      mockedService.getLogsWithFilter.mockResolvedValue({
        items: [],
        count: 0,
        total: 0,
      });

      await request(app).get('/api/logs/bot/bot-1?limit=500&offset=-10');

      expect(mockedService.getLogsWithFilter).toHaveBeenCalledWith({
        bot: 'bot-1',
        messageSearch: undefined,
        limit: 100,
        offset: 0,
      });
    });

    it('maps "not found" to 400', async () => {
      mockedService.getLogsWithFilter.mockRejectedValue(
        new Error('Bot with ID x not found')
      );

      const res = await request(app).get('/api/logs/bot/x');

      expect(res.status).toBe(400);
      expect(res.body).toMatchSnapshot();
    });
  });

  describe('GET /api/logs/worker/:workerId', () => {
    it('returns 400 when botId is missing', async () => {
      const res = await request(app).get('/api/logs/worker/worker-1');

      expect(res.status).toBe(400);
      expect(res.body).toMatchSnapshot();
    });

    it('returns logs for the worker when botId is provided', async () => {
      mockedService.getLogsByWorkerId.mockResolvedValue({
        items: [makeLog()],
        count: 1,
        total: 1,
      });

      const res = await request(app).get(
        '/api/logs/worker/worker-1?botId=bot-1&limit=10&offset=0'
      );

      expect(res.status).toBe(200);
      expect(mockedService.getLogsByWorkerId).toHaveBeenCalledWith(
        'bot-1',
        'worker-1',
        10,
        0
      );
      expect(res.body).toMatchSnapshot();
    });
  });

  describe('POST /api/logs', () => {
    it('creates a log', async () => {
      mockedService.createLog.mockResolvedValue(makeLog());

      const res = await request(app).post('/api/logs').send({
        message: 'Hello',
        bot: 'bot-1',
        worker: 'worker-1',
      });

      expect(res.status).toBe(201);
      expect(res.body).toMatchSnapshot();
    });

    it('returns 400 for validation errors recognised by the error handler', async () => {
      mockedService.createLog.mockRejectedValue(new Error('Invalid worker ID'));

      const res = await request(app).post('/api/logs').send({});

      expect(res.status).toBe(400);
      expect(res.body).toMatchSnapshot();
    });
  });
});
