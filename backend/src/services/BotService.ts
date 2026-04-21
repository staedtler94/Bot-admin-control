import { BotRepository } from '../repositories/BotRepository';
import { Bot, CreateBotInput, UpdateBotInput } from '../models/Bot';

export class BotService {
  static async getAllBots(limit: number = 20, offset: number = 0): Promise<{ items: Bot[]; count: number }> {
    if (limit > 100) limit = 100;
    if (limit < 1) limit = 1;
    if (offset < 0) offset = 0;

    return BotRepository.findAll(limit, offset);
  }

  static async getBotById(id: string): Promise<Bot> {
    if (!id || typeof id !== 'string') {
      throw new Error('Invalid bot ID');
    }

    const bot = await BotRepository.findById(id);
    if (!bot) {
      throw new Error(`Bot with ID ${id} not found`);
    }

    return bot;
  }

  static async createBot(input: CreateBotInput): Promise<Bot> {
    if (!input.name || typeof input.name !== 'string' || input.name.trim().length === 0) {
      throw new Error('Bot name is required and must be a non-empty string');
    }

    if (input.status && !['DISABLED', 'ENABLED', 'PAUSED'].includes(input.status)) {
      throw new Error('Invalid bot status. Must be one of: DISABLED, ENABLED, PAUSED');
    }

    return BotRepository.create(input);
  }

  static async updateBot(id: string, input: UpdateBotInput): Promise<Bot> {
    if (!id || typeof id !== 'string') {
      throw new Error('Invalid bot ID');
    }

    if (input.name !== undefined && (typeof input.name !== 'string' || input.name.trim().length === 0)) {
      throw new Error('Bot name must be a non-empty string');
    }

    if (input.status && !['DISABLED', 'ENABLED', 'PAUSED'].includes(input.status)) {
      throw new Error('Invalid bot status. Must be one of: DISABLED, ENABLED, PAUSED');
    }

    // Verify bot exists
    const existing = await BotRepository.findById(id);
    if (!existing) {
      throw new Error(`Bot with ID ${id} not found`);
    }

    return BotRepository.update(id, input);
  }

  static async deleteBot(id: string): Promise<void> {
    if (!id || typeof id !== 'string') {
      throw new Error('Invalid bot ID');
    }

    const existing = await BotRepository.findById(id);
    if (!existing) {
      throw new Error(`Bot with ID ${id} not found`);
    }

    await BotRepository.delete(id);
  }
}
