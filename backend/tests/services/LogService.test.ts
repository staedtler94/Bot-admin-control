import { LogService } from '../../src/services/LogService';
import { LogRepository } from '../../src/repositories/LogRepository';
import { BotRepository } from '../../src/repositories/BotRepository';
import { WorkerRepository } from '../../src/repositories/WorkerRepository';
import { makeBot, makeLog, makeWorker } from '../fixtures';

jest.mock('../../src/repositories/LogRepository');
jest.mock('../../src/repositories/BotRepository');
jest.mock('../../src/repositories/WorkerRepository');

const mockedLogRepo = LogRepository as jest.Mocked<typeof LogRepository>;
const mockedBotRepo = BotRepository as jest.Mocked<typeof BotRepository>;
const mockedWorkerRepo = WorkerRepository as jest.Mocked<typeof WorkerRepository>;

describe('LogService', () => {
  describe('getLogsByBotId', () => {
    it('returns logs when bot exists', async () => {
      mockedBotRepo.findById.mockResolvedValue(makeBot());
      mockedLogRepo.findByBotId.mockResolvedValue({ items: [makeLog()], count: 1, total: 1 });

      const result = await LogService.getLogsByBotId('bot-1');

      expect(mockedLogRepo.findByBotId).toHaveBeenCalledWith('bot-1', 20, 0);
      expect(result).toMatchSnapshot();
    });

    it('throws when bot is missing', async () => {
      mockedBotRepo.findById.mockResolvedValue(null);

      await expect(LogService.getLogsByBotId('missing')).rejects.toThrow(
        'Bot with ID missing not found'
      );
    });

    it('clamps limit/offset', async () => {
      mockedBotRepo.findById.mockResolvedValue(makeBot());
      mockedLogRepo.findByBotId.mockResolvedValue({ items: [], count: 0, total: 0 });

      await LogService.getLogsByBotId('bot-1', 500, -5);

      expect(mockedLogRepo.findByBotId).toHaveBeenCalledWith('bot-1', 100, 0);
    });
  });

  describe('getLogsByWorkerId', () => {
    it('returns logs when worker exists', async () => {
      mockedWorkerRepo.findById.mockResolvedValue(makeWorker());
      mockedLogRepo.findByWorkerId.mockResolvedValue({ items: [makeLog()], count: 1, total: 1 });

      const result = await LogService.getLogsByWorkerId('bot-1', 'worker-1');

      expect(mockedLogRepo.findByWorkerId).toHaveBeenCalledWith('bot-1', 'worker-1', 20, 0);
      expect(result).toMatchSnapshot();
    });

    it('throws when worker is missing', async () => {
      mockedWorkerRepo.findById.mockResolvedValue(null);

      await expect(
        LogService.getLogsByWorkerId('bot-1', 'worker-1')
      ).rejects.toThrow('Worker with ID worker-1 not found');
    });
  });

  describe('getLogsWithFilter', () => {
    it('requires at least bot or worker', async () => {
      await expect(LogService.getLogsWithFilter({})).rejects.toThrow(
        'Either bot ID or worker ID is required'
      );
    });

    it('filters by bot with clamped limit/offset', async () => {
      mockedBotRepo.findById.mockResolvedValue(makeBot());
      mockedLogRepo.findWithFilter.mockResolvedValue({ items: [makeLog()], count: 1, total: 1 });

      const result = await LogService.getLogsWithFilter({
        bot: 'bot-1',
        messageSearch: 'Hello',
        limit: 500,
        offset: -5,
      });

      expect(mockedLogRepo.findWithFilter).toHaveBeenCalledWith({
        bot: 'bot-1',
        messageSearch: 'Hello',
        limit: 100,
        offset: 0,
      });
      expect(result).toMatchSnapshot();
    });
  });

  describe('createLog', () => {
    it('creates a log when bot and worker exist', async () => {
      mockedBotRepo.findById.mockResolvedValue(makeBot());
      mockedWorkerRepo.findById.mockResolvedValue(makeWorker());
      mockedLogRepo.create.mockResolvedValue(makeLog());

      const log = await LogService.createLog({
        message: 'Hello',
        bot: 'bot-1',
        worker: 'worker-1',
      });

      expect(log).toMatchSnapshot();
    });

    it('rejects empty message', async () => {
      await expect(
        LogService.createLog({ message: '  ', bot: 'bot-1', worker: 'worker-1' })
      ).rejects.toThrow('Log message is required');
    });

    it('throws when worker is missing', async () => {
      mockedBotRepo.findById.mockResolvedValue(makeBot());
      mockedWorkerRepo.findById.mockResolvedValue(null);

      await expect(
        LogService.createLog({ message: 'M', bot: 'bot-1', worker: 'missing' })
      ).rejects.toThrow('Worker with ID missing not found');
    });
  });
});
