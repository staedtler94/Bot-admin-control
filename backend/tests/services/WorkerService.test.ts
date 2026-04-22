import { WorkerService } from '../../src/services/WorkerService';
import { WorkerRepository } from '../../src/repositories/WorkerRepository';
import { BotRepository } from '../../src/repositories/BotRepository';
import { makeBot, makeWorker } from '../fixtures';

jest.mock('../../src/repositories/WorkerRepository');
jest.mock('../../src/repositories/BotRepository');

const mockedWorkerRepo = WorkerRepository as jest.Mocked<typeof WorkerRepository>;
const mockedBotRepo = BotRepository as jest.Mocked<typeof BotRepository>;

describe('WorkerService', () => {
  describe('getAllWorkers', () => {
    it('returns paginated items with defaults', async () => {
      mockedWorkerRepo.findAll.mockResolvedValue({ items: [makeWorker()], count: 1 });

      const result = await WorkerService.getAllWorkers();

      expect(mockedWorkerRepo.findAll).toHaveBeenCalledWith(20, 0);
      expect(result).toMatchSnapshot();
    });

    it('clamps out-of-range limit/offset', async () => {
      mockedWorkerRepo.findAll.mockResolvedValue({ items: [], count: 0 });

      await WorkerService.getAllWorkers(500, -5);

      expect(mockedWorkerRepo.findAll).toHaveBeenCalledWith(100, 0);
    });
  });

  describe('getWorkerById', () => {
    it('returns the worker', async () => {
      mockedWorkerRepo.findById.mockResolvedValue(makeWorker());

      const worker = await WorkerService.getWorkerById('worker-1', 'bot-1');

      expect(worker).toMatchSnapshot();
      expect(mockedWorkerRepo.findById).toHaveBeenCalledWith('worker-1', 'bot-1');
    });

    it('throws when workerId missing', async () => {
      await expect(WorkerService.getWorkerById('', 'bot-1')).rejects.toThrow(
        'Invalid worker ID'
      );
    });

    it('throws when botId missing', async () => {
      await expect(WorkerService.getWorkerById('worker-1', '')).rejects.toThrow(
        'Invalid bot ID'
      );
    });

    it('throws when not found', async () => {
      mockedWorkerRepo.findById.mockResolvedValue(null);

      await expect(
        WorkerService.getWorkerById('worker-1', 'bot-1')
      ).rejects.toThrow('Worker with ID worker-1 not found');
    });
  });

  describe('getWorkersByBotId', () => {
    it('returns workers when bot exists', async () => {
      mockedBotRepo.findById.mockResolvedValue(makeBot());
      mockedWorkerRepo.findByBotId.mockResolvedValue({ items: [makeWorker()], count: 1 });

      const result = await WorkerService.getWorkersByBotId('bot-1');

      expect(result).toMatchSnapshot();
      expect(mockedWorkerRepo.findByBotId).toHaveBeenCalledWith('bot-1', 20);
    });

    it('throws when bot is missing', async () => {
      mockedBotRepo.findById.mockResolvedValue(null);

      await expect(WorkerService.getWorkersByBotId('missing')).rejects.toThrow(
        'Bot with ID missing not found'
      );
    });
  });

  describe('createWorker', () => {
    it('creates a worker when bot exists', async () => {
      mockedBotRepo.findById.mockResolvedValue(makeBot());
      mockedWorkerRepo.create.mockResolvedValue(makeWorker());

      const worker = await WorkerService.createWorker({ name: 'W', bot: 'bot-1' });

      expect(worker).toMatchSnapshot();
    });

    it('rejects missing name', async () => {
      await expect(
        WorkerService.createWorker({ name: '', bot: 'bot-1' })
      ).rejects.toThrow('Worker name is required');
    });

    it('rejects missing bot', async () => {
      await expect(
        // @ts-expect-error intentionally missing bot
        WorkerService.createWorker({ name: 'W' })
      ).rejects.toThrow('Bot ID is required');
    });

    it('throws when bot does not exist', async () => {
      mockedBotRepo.findById.mockResolvedValue(null);

      await expect(
        WorkerService.createWorker({ name: 'W', bot: 'missing' })
      ).rejects.toThrow('Bot with ID missing not found');
    });
  });

  describe('updateWorker', () => {
    it('updates when worker exists', async () => {
      mockedWorkerRepo.findById.mockResolvedValue(makeWorker());
      mockedWorkerRepo.update.mockResolvedValue(makeWorker({ name: 'Renamed' }));

      const worker = await WorkerService.updateWorker('worker-1', 'bot-1', { name: 'Renamed' });

      expect(worker).toMatchSnapshot();
    });

    it('throws when worker is missing', async () => {
      mockedWorkerRepo.findById.mockResolvedValue(null);

      await expect(
        WorkerService.updateWorker('missing', 'bot-1', { name: 'X' })
      ).rejects.toThrow('Worker with ID missing not found');
    });
  });

  describe('deleteWorker', () => {
    it('deletes when worker exists', async () => {
      mockedWorkerRepo.findById.mockResolvedValue(makeWorker());
      mockedWorkerRepo.delete.mockResolvedValue(undefined);

      await WorkerService.deleteWorker('worker-1', 'bot-1');

      expect(mockedWorkerRepo.delete).toHaveBeenCalledWith('worker-1', 'bot-1');
    });

    it('throws when worker is missing', async () => {
      mockedWorkerRepo.findById.mockResolvedValue(null);

      await expect(
        WorkerService.deleteWorker('missing', 'bot-1')
      ).rejects.toThrow('Worker with ID missing not found');
    });
  });
});
