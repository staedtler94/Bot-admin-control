import axiosInstance from './api';
import { Bot, CreateBotInput, UpdateBotInput } from '../types/bot';
import { ApiResponse } from '../types/api';

export const botService = {
  getAllBots: async (limit: number = 20, offset: number = 0) => {
    const response = await axiosInstance.get<ApiResponse<Bot[]>>('/bots', {
      params: { limit, offset },
    });
    return response.data;
  },

  getBotById: async (id: string) => {
    const response = await axiosInstance.get<ApiResponse<Bot>>(`/bots/${id}`);
    return response.data;
  },

  createBot: async (input: CreateBotInput) => {
    const response = await axiosInstance.post<ApiResponse<Bot>>('/bots', input);
    return response.data;
  },

  updateBot: async (id: string, input: UpdateBotInput) => {
    const response = await axiosInstance.put<ApiResponse<Bot>>(`/bots/${id}`, input);
    return response.data;
  },

  deleteBot: async (id: string) => {
    const response = await axiosInstance.delete<ApiResponse<void>>(`/bots/${id}`);
    return response.data;
  },
};
