import { ApplicationException } from "./application.exception";

export class RecurrenceException extends ApplicationException {
  constructor() {
    super("User already checked with the date range");
  }
}
