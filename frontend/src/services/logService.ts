import axiosInstance from './api';
import { Log, CreateLogInput } from '../types/log';
import { ApiResponse } from '../types/api';

export const logService = {
  getLogsByBotId: async (botId: string, limit: number = 20, offset: number = 0, search?: string) => {
    const response = await axiosInstance.get<ApiResponse<Log[]>>(`/logs/bot/${botId}`, {
      params: { limit, offset, search },
    });
    return response.data;
  },

  getLogsByWorkerId: async (workerId: string, botId: string, limit: number = 20, offset: number = 0, search?: string) => {
    const response = await axiosInstance.get<ApiResponse<Log[]>>(`/logs/worker/${workerId}`, {
      params: { botId, limit, offset, search },
    });
    return response.data;
  },

  createLog: async (input: CreateLogInput) => {
    const response = await axiosInstance.post<ApiResponse<Log>>('/logs', input);
    return response.data;
  },
};
