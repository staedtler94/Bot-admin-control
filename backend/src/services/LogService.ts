import { LogRepository } from '../repositories/LogRepository';
import { BotRepository } from '../repositories/BotRepository';
import { WorkerRepository } from '../repositories/WorkerRepository';
import { Log, CreateLogInput, LogFilter } from '../models/Log';
import logger from '../utils/logger';

export class LogService {
  static async getLogsByBotId(botId: string, limit: number = 20, offset: number = 0): Promise<{ items: Log[]; count: number; total: number }> {
    if (!botId || typeof botId !== 'string') {
      throw new Error('Invalid bot ID');
    }

    // Verify bot exists
    const bot = await BotRepository.findById(botId);
    if (!bot) {
      throw new Error(`Bot with ID ${botId} not found`);
    }

    if (limit > 100) limit = 100;
    if (limit < 1) limit = 1;
    if (offset < 0) offset = 0;

    return LogRepository.findByBotId(botId, limit, offset);
  }

  static async getLogsByWorkerId(botId: string, workerId: string, limit: number = 20, offset: number = 0): Promise<{ items: Log[]; count: number; total: number }> {
    if (!botId || typeof botId !== 'string') {
      throw new Error('Invalid bot ID');
    }

    if (!workerId || typeof workerId !== 'string') {
      throw new Error('Invalid worker ID');
    }

    // Verify worker exists
    const worker = await WorkerRepository.findById(workerId, botId);
    if (!worker) {
      throw new Error(`Worker with ID ${workerId} not found`);
    }

    if (limit > 100) limit = 100;
    if (limit < 1) limit = 1;
    if (offset < 0) offset = 0;

    return LogRepository.findByWorkerId(botId, workerId, limit, offset);
  }

  static async getLogsWithFilter(filter: LogFilter): Promise<{ items: Log[]; count: number; total: number }> {
    if (!filter.bot && !filter.worker) {
      throw new Error('Either bot ID or worker ID is required');
    }

    if (filter.bot) {
      const bot = await BotRepository.findById(filter.bot);
      if (!bot) {
        throw new Error(`Bot with ID ${filter.bot} not found`);
      }
    }

    if (filter.worker && filter.bot) {
      const worker = await WorkerRepository.findById(filter.worker, filter.bot);
      if (!worker) {
        throw new Error(`Worker with ID ${filter.worker} not found`);
      }
    }

    const limit = Math.min(filter.limit || 20, 100);
    const offset = Math.max(filter.offset || 0, 0);

    return LogRepository.findWithFilter({
      ...filter,
      limit,
      offset,
    });
  }

  static async createLog(input: CreateLogInput): Promise<Log> {
    if (!input.message || typeof input.message !== 'string' || input.message.trim().length === 0) {
      throw new Error('Log message is required and must be a non-empty string');
    }

    if (!input.bot || typeof input.bot !== 'string') {
      throw new Error('Bot ID is required');
    }

    if (!input.worker || typeof input.worker !== 'string') {
      throw new Error('Worker ID is required');
    }

    // Verify bot exists
    const bot = await BotRepository.findById(input.bot);
    if (!bot) {
      throw new Error(`Bot with ID ${input.bot} not found`);
    }

    // Verify worker exists
    const worker = await WorkerRepository.findById(input.worker, input.bot);
    logger.info(`Creating log worker ${input.bot}#${input.worker}`);
    if (!worker) {
      throw new Error(`Worker with ID ${input.worker} not found`);
    }

    return LogRepository.create(input);
  }
}
