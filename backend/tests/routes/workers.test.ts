import request from 'supertest';
import { createApp } from '../../src/app';
import { WorkerService } from '../../src/services/WorkerService';
import { makeWorker } from '../fixtures';

jest.mock('../../src/services/WorkerService');

const mockedService = WorkerService as jest.Mocked<typeof WorkerService>;

const workerServiceMethodNames: (keyof typeof WorkerService)[] = [
  'getAllWorkers',
  'getWorkerById',
  'getWorkersByBotId',
  'createWorker',
  'updateWorker',
  'deleteWorker',
];

describe('Workers routes', () => {
  const app = createApp();

  // Route handlers share the mocked class with unit tests; reset between cases
  // so mockRejectedValue / mockImplementation does not leak in one Jest worker.
  beforeEach(() => {
    workerServiceMethodNames.forEach((name) => {
      const fn = WorkerService[name];
      if (jest.isMockFunction(fn)) {
        fn.mockReset();
      }
    });
  });

  describe('GET /api/workers', () => {
    it('returns paginated workers', async () => {
      mockedService.getAllWorkers.mockResolvedValue({ items: [makeWorker()], count: 1 });

      const res = await request(app).get('/api/workers');

      expect(res.status).toBe(200);
      expect(mockedService.getAllWorkers).toHaveBeenCalledWith(20, 0);
      expect(res.body).toMatchSnapshot();
    });
  });

  describe('GET /api/workers/bot/:botId', () => {
    it('returns workers for a bot', async () => {
      mockedService.getWorkersByBotId.mockResolvedValue({
        items: [makeWorker()],
        count: 1,
      });

      const res = await request(app).get('/api/workers/bot/bot-1');

      expect(res.status).toBe(200);
      expect(res.body).toMatchSnapshot();
    });
  });

  describe('GET /api/workers/:workerId', () => {
    it('returns 400 when botId is missing', async () => {
      const res = await request(app).get('/api/workers/worker-1');

      expect(res.status).toBe(400);
      expect(res.body).toMatchSnapshot();
    });

    it('returns the worker when botId is provided', async () => {
      mockedService.getWorkerById.mockResolvedValue(makeWorker());

      const res = await request(app).get('/api/workers/worker-1?botId=bot-1');

      expect(res.status).toBe(200);
      expect(mockedService.getWorkerById).toHaveBeenCalledWith('worker-1', 'bot-1');
      expect(res.body).toMatchSnapshot();
    });

    it('maps "not found" to 400 via errorHandler', async () => {
      mockedService.getWorkerById.mockRejectedValue(
        new Error('Worker with ID worker-1 not found')
      );

      const res = await request(app).get('/api/workers/worker-1?botId=bot-1');

      expect(res.status).toBe(400);
      expect(res.body).toMatchSnapshot();
    });
  });

  describe('POST /api/workers', () => {
    it('creates a worker', async () => {
      mockedService.createWorker.mockResolvedValue(makeWorker());

      const res = await request(app)
        .post('/api/workers')
        .send({ name: 'W', bot: 'bot-1' });

      expect(res.status).toBe(201);
      expect(res.body).toMatchSnapshot();
    });
  });

  describe('PUT /api/workers/:workerId', () => {
    it('returns 400 without botId', async () => {
      const res = await request(app)
        .put('/api/workers/worker-1')
        .send({ name: 'W' });

      expect(res.status).toBe(400);
      expect(res.body).toMatchSnapshot();
    });

    it('updates a worker', async () => {
      mockedService.updateWorker.mockResolvedValue(makeWorker({ name: 'Renamed' }));

      const res = await request(app)
        .put('/api/workers/worker-1?botId=bot-1')
        .send({ name: 'Renamed' });

      expect(res.status).toBe(200);
      expect(res.body).toMatchSnapshot();
    });
  });

  describe('DELETE /api/workers/:workerId', () => {
    it('returns 400 without botId', async () => {
      const res = await request(app).delete('/api/workers/worker-1');

      expect(res.status).toBe(400);
      expect(res.body).toMatchSnapshot();
    });

    it('deletes a worker', async () => {
      mockedService.deleteWorker.mockResolvedValue(undefined);

      const res = await request(app).delete('/api/workers/worker-1?botId=bot-1');

      expect(res.status).toBe(200);
      expect(res.body).toMatchSnapshot();
    });
  });
});
