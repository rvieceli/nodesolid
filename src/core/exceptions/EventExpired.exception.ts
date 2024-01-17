import { ApplicationException } from "./application.exception";

export class EventExpiredException extends ApplicationException {
  constructor() {
    super("The event has expired");
  }
}
