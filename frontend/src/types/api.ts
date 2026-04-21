export interface PaginationOptions {
  limit: number;
  offset: number;
  total: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    statusCode: number;
  };
  pagination?: PaginationOptions;
}
