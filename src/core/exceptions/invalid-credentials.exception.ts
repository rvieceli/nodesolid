import { ApplicationException } from "./application.exception";

export class InvalidCredentialsException extends ApplicationException {
  constructor() {
    super("User already exists");
  }
}
