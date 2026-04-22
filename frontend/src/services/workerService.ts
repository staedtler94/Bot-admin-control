import axiosInstance from './api';
import { Worker, CreateWorkerInput, UpdateWorkerInput } from '../types/worker';
import { ApiResponse } from '../types/api';

export const workerService = {
  getAllWorkers: async (limit: number = 20, offset: number = 0) => {
    const response = await axiosInstance.get<ApiResponse<Worker[]>>('/workers', {
      params: { limit, offset },
    });
    return response.data;
  },

  getWorkerById: async (id: string, botId: string) => {
    const response = await axiosInstance.get<ApiResponse<Worker>>(`/workers/${id}`, {
      params: { botId },
    });
    return response.data;
  },

  getWorkersByBotId: async (botId: string, limit: number = 20) => {
    const response = await axiosInstance.get<ApiResponse<Worker[]>>(`/workers/bot/${botId}`, {
      params: { limit },
    });
    return response.data;
  },

  createWorker: async (input: CreateWorkerInput) => {
    const response = await axiosInstance.post<ApiResponse<Worker>>('/workers', input);
    return response.data;
  },

  updateWorker: async (id: string, input: UpdateWorkerInput) => {
    const response = await axiosInstance.put<ApiResponse<Worker>>(`/workers/${id}`, input);
    return response.data;
  },

  deleteWorker: async (id: string) => {
    const response = await axiosInstance.delete<ApiResponse<void>>(`/workers/${id}`);
    return response.data;
  },
};
