import { Bot } from '../src/models/Bot';
import { Worker } from '../src/models/Worker';
import { Log } from '../src/models/Log';

export const FIXED_TIMESTAMP = 1_700_000_000_000;
export const FIXED_ISO = '2023-11-14T22:13:20.000Z';

export const makeBot = (overrides: Partial<Bot> = {}): Bot => ({
  id: 'bot-1',
  name: 'Test Bot',
  description: 'A bot for testing',
  status: 'ENABLED',
  created: FIXED_TIMESTAMP,
  ...overrides,
});

export const makeWorker = (overrides: Partial<Worker> = {}): Worker => ({
  id: 'worker-1',
  name: 'Test Worker',
  description: 'A worker for testing',
  bot: 'bot-1',
  created: FIXED_TIMESTAMP,
  ...overrides,
});

export const makeLog = (overrides: Partial<Log> = {}): Log => ({
  id: 'log-1',
  created: FIXED_ISO,
  message: 'Hello from the worker',
  bot: 'bot-1',
  worker: 'worker-1',
  ...overrides,
});
