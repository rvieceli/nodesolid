import { PageSizePolicy } from "../policies/page-size.policy";
import { ApplicationException } from "./application.exception";

export class PageSizeTooBigException extends ApplicationException {
  constructor() {
    super(
      `Page size must be less than or equal to ${PageSizePolicy.MAX_PAGE_SIZE}`,
    );
  }
}
