import { PaginatedRequest } from "@/core/utils/pagination";

export abstract class InMemory {
  constructor() {
    if (process.env.NODE_ENV === "production")
      throw new Error("Cannot use this repository in production");
  }

  paginationToSlice(pagination: PaginatedRequest): [number, number] {
    return [
      (pagination.page - 1) * pagination.pageSize,
      pagination.page * pagination.pageSize,
    ];
  }

  generatedConcat<T extends Record<string, unknown>>(
    object: T,
    columns: (keyof T)[],
  ): string {
    return columns.map((column) => object[column]).join(" | ");
  }
}
