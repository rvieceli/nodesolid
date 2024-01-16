import { PageSizeTooBigException } from "../exceptions/page-size-too-big.exception";

export class PageSizePolicy {
  static DEFAULT_PAGE_SIZE = 10;
  static MAX_PAGE_SIZE = 50;

  static isAllowed(pageSize: number): boolean {
    return PageSizePolicy.MAX_PAGE_SIZE >= pageSize;
  }

  static isAllowedOrThrow(pageSize: number): void {
    if (PageSizePolicy.isAllowed(pageSize)) return;

    throw new PageSizeTooBigException();
  }

  static getPageSize(pageSize: number): number {
    return Math.min(pageSize, PageSizePolicy.MAX_PAGE_SIZE);
  }
}
