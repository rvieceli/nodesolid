import { ApplicationException } from "./application.exception";

export class ForbiddenException extends ApplicationException {
  constructor() {
    super("Forbidden");
    this.statusCode = 403;
  }
}
