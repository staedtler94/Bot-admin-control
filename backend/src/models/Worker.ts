export interface Worker {
  id: string;
  name: string;
  description?: string;
  bot: string; // Bot ID
  created: number;
}

export interface CreateWorkerInput {
  name: string;
  description?: string;
  bot: string;
}

export interface UpdateWorkerInput {
  name?: string;
  description?: string;
}
