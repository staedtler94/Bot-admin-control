import { BotService } from '../../src/services/BotService';
import { BotRepository } from '../../src/repositories/BotRepository';
import { makeBot } from '../fixtures';

jest.mock('../../src/repositories/BotRepository');

const mockedRepo = BotRepository as jest.Mocked<typeof BotRepository>;

describe('BotService', () => {
  describe('getAllBots', () => {
    it('returns paginated items with defaults', async () => {
      mockedRepo.findAll.mockResolvedValue({ items: [makeBot()], count: 1 });

      const result = await BotService.getAllBots();

      expect(mockedRepo.findAll).toHaveBeenCalledWith(20, 0);
      expect(result).toMatchSnapshot();
    });

    it('clamps limit to max (100) and offset to min (0)', async () => {
      mockedRepo.findAll.mockResolvedValue({ items: [], count: 0 });

      await BotService.getAllBots(500, -10);

      expect(mockedRepo.findAll).toHaveBeenCalledWith(100, 0);
    });

    it('clamps limit below 1 up to 1', async () => {
      mockedRepo.findAll.mockResolvedValue({ items: [], count: 0 });

      await BotService.getAllBots(0, 0);

      expect(mockedRepo.findAll).toHaveBeenCalledWith(1, 0);
    });
  });

  describe('getBotById', () => {
    it('returns the bot when found', async () => {
      mockedRepo.findById.mockResolvedValue(makeBot());

      const bot = await BotService.getBotById('bot-1');

      expect(bot).toMatchSnapshot();
      expect(mockedRepo.findById).toHaveBeenCalledWith('bot-1');
    });

    it('throws when id is empty', async () => {
      await expect(BotService.getBotById('')).rejects.toThrow('Invalid bot ID');
    });

    it('throws when bot is not found', async () => {
      mockedRepo.findById.mockResolvedValue(null);

      await expect(BotService.getBotById('missing')).rejects.toThrow(
        'Bot with ID missing not found'
      );
    });
  });

  describe('createBot', () => {
    it('creates a bot with default status ENABLED', async () => {
      mockedRepo.create.mockResolvedValue(makeBot());

      const bot = await BotService.createBot({ name: 'New Bot' });

      expect(mockedRepo.create).toHaveBeenCalledWith({ name: 'New Bot' });
      expect(bot).toMatchSnapshot();
    });

    it('rejects empty name', async () => {
      await expect(BotService.createBot({ name: '   ' })).rejects.toThrow(
        'Bot name is required and must be a non-empty string'
      );
    });

    it('rejects invalid status', async () => {
      await expect(
        // @ts-expect-error intentionally invalid status
        BotService.createBot({ name: 'x', status: 'BROKEN' })
      ).rejects.toThrow('Invalid bot status');
    });
  });

  describe('updateBot', () => {
    it('updates the bot when it exists', async () => {
      mockedRepo.findById.mockResolvedValue(makeBot());
      mockedRepo.update.mockResolvedValue(makeBot({ name: 'Updated' }));

      const bot = await BotService.updateBot('bot-1', { name: 'Updated' });

      expect(bot).toMatchSnapshot();
    });

    it('throws when bot does not exist', async () => {
      mockedRepo.findById.mockResolvedValue(null);

      await expect(
        BotService.updateBot('missing', { name: 'X' })
      ).rejects.toThrow('Bot with ID missing not found');
    });

    it('rejects empty name override', async () => {
      await expect(
        BotService.updateBot('bot-1', { name: '  ' })
      ).rejects.toThrow('Bot name must be a non-empty string');
    });
  });

  describe('deleteBot', () => {
    it('deletes the bot when it exists', async () => {
      mockedRepo.findById.mockResolvedValue(makeBot());
      mockedRepo.delete.mockResolvedValue(undefined);

      await BotService.deleteBot('bot-1');

      expect(mockedRepo.delete).toHaveBeenCalledWith('bot-1');
    });

    it('throws when bot does not exist', async () => {
      mockedRepo.findById.mockResolvedValue(null);

      await expect(BotService.deleteBot('missing')).rejects.toThrow(
        'Bot with ID missing not found'
      );
    });
  });
});
