import { WorkerRepository } from '../repositories/WorkerRepository';
import { BotRepository } from '../repositories/BotRepository';
import { Worker, CreateWorkerInput, UpdateWorkerInput } from '../models/Worker';

export class WorkerService {
  static async getAllWorkers(limit: number = 20, offset: number = 0): Promise<{ items: Worker[]; count: number }> {
    if (limit > 100) limit = 100;
    if (limit < 1) limit = 1;
    if (offset < 0) offset = 0;

    return WorkerRepository.findAll(limit, offset);
  }

  static async getWorkerById(workerId: string, botId: string): Promise<Worker> {
    if (!workerId || typeof workerId !== 'string') {
      throw new Error('Invalid worker ID');
    }

    if (!botId || typeof botId !== 'string') {
      throw new Error('Invalid bot ID');
    }

    const worker = await WorkerRepository.findById(workerId, botId);
    if (!worker) {
      throw new Error(`Worker with ID ${workerId} not found`);
    }

    return worker;
  }

  static async getWorkersByBotId(botId: string, limit: number = 20): Promise<{ items: Worker[]; count: number }> {
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

    return WorkerRepository.findByBotId(botId, limit);
  }

  static async createWorker(input: CreateWorkerInput): Promise<Worker> {
    if (!input.name || typeof input.name !== 'string' || input.name.trim().length === 0) {
      throw new Error('Worker name is required and must be a non-empty string');
    }

    if (!input.bot || typeof input.bot !== 'string') {
      throw new Error('Bot ID is required');
    }

    // Verify bot exists
    const bot = await BotRepository.findById(input.bot);
    if (!bot) {
      throw new Error(`Bot with ID ${input.bot} not found`);
    }

    return WorkerRepository.create(input);
  }

  static async updateWorker(workerId: string, botId: string, input: UpdateWorkerInput): Promise<Worker> {
    if (!workerId || typeof workerId !== 'string') {
      throw new Error('Invalid worker ID');
    }

    if (!botId || typeof botId !== 'string') {
      throw new Error('Invalid bot ID');
    }

    if (input.name !== undefined && (typeof input.name !== 'string' || input.name.trim().length === 0)) {
      throw new Error('Worker name must be a non-empty string');
    }

    // Verify worker exists
    const existing = await WorkerRepository.findById(workerId, botId);
    if (!existing) {
      throw new Error(`Worker with ID ${workerId} not found`);
    }

    return WorkerRepository.update(workerId, botId, input);
  }

  static async deleteWorker(workerId: string, botId: string): Promise<void> {
    if (!workerId || typeof workerId !== 'string') {
      throw new Error('Invalid worker ID');
    }

    if (!botId || typeof botId !== 'string') {
      throw new Error('Invalid bot ID');
    }

    const existing = await WorkerRepository.findById(workerId, botId);
    if (!existing) {
      throw new Error(`Worker with ID ${workerId} not found`);
    }

    await WorkerRepository.delete(workerId, botId);
  }
}
