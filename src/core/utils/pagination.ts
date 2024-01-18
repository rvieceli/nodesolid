export interface PaginatedRequest {
  page: number;
  pageSize: number;
}

export class PaginatedResponse<T> {
  items: T[];
  page: number;
  total: number;
  pageSize: number;
  totalPages: number;

  constructor(items: T[], total: number, pagination: PaginatedRequest) {
    this.items = items;
    this.total = total;
    this.page = pagination.page;
    this.pageSize = pagination.pageSize;
    this.totalPages = Math.ceil(total / pagination.pageSize);
  }
}
