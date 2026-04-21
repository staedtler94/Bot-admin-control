export interface Worker {
  id: string;
  name: string;
  description?: string;
  bot: string;
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
