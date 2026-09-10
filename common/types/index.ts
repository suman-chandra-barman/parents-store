/* eslint-disable @typescript-eslint/no-explicit-any */
export type ApiResponse<T = any> = Partial<{
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
  pagination: Pagination;
  meta: Record<string, any>;
  traceId: string;
}>;

export type Pagination = {
  total: number;
  limit: number;
  page: number;
  totalPages: number;
};

export type Media = {
  id: string;
  url: string;
  bytes: string;
  height: number;
  width: number;
  mimeType: string;
  metadata: {
    originalName: string;
  };
  type: string;
};
