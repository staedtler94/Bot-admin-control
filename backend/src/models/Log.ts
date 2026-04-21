export interface Log {
  id: string;
  created: string; // ISO Timestamp
  message: string;
  bot: string; // Bot ID
  worker: string; // Worker ID
}

export interface CreateLogInput {
  id?: string;
  message: string;
  bot: string;
  worker: string;
}

export interface LogFilter {
  id?: string;
  bot?: string;
  worker?: string;
  messageSearch?: string;
  startDate?: string;
  endDate?: string;
  limit?: number;
  offset?: number;
}
