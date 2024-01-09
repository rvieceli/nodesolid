import { ApplicationException } from "./application.exception";

export class UserAlreadyExistsException extends ApplicationException {
  constructor() {
    super("User already exists");
    this.statusCode = 409;
  }
}
