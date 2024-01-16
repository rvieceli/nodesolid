export interface PaginatedRequest {
  page: number;
  pageSize: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  page: number;
  total: number;
  pageSize: number;
  totalPages: number;
}
