export const API_PREFIX = process.env.API_PREFIX || '/api';
export const PORT = parseInt(process.env.PORT || '3000', 10);
export const NODE_ENV = process.env.NODE_ENV || 'development';

export const PAGINATION = {
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
};

export const BOT_STATUS = {
  DISABLED: 'DISABLED',
  ENABLED: 'ENABLED',
  PAUSED: 'PAUSED',
} as const;
