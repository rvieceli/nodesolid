import { ApplicationException } from "./application.exception";

export class UnauthorizedException extends ApplicationException {
  constructor() {
    super("Unauthorized");
    this.statusCode = 401;
  }
}
