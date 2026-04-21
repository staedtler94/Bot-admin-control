export type BotStatus = 'DISABLED' | 'ENABLED' | 'PAUSED';

export interface Bot {
  id: string;
  name: string;
  description?: string;
  status: BotStatus;
  created: number;
}

export interface CreateBotInput {
  name: string;
  description?: string;
  status?: BotStatus;
}

export interface UpdateBotInput {
  name?: string;
  description?: string;
  status?: BotStatus;
}
