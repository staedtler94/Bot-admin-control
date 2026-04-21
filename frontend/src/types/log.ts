export interface Log {
  id: string;
  created: string;
  message: string;
  bot: string;
  worker: string;
}

export interface CreateLogInput {
  message: string;
  bot: string;
  worker: string;
}

export interface LogFilter {
  bot?: string;
  worker?: string;
  messageSearch?: string;
  limit?: number;
  offset?: number;
}
