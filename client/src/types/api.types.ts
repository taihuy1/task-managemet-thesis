export interface ApiResponse<T> {
  data: T;
  message?: string;
  success?: boolean;
  timestamp?: string;
}

export interface ApiError {
  message: string;
  status: number;
  code?: string;
}
