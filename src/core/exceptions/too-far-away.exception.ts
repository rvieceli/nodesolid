import { ApplicationException } from "./application.exception";

export class TooFarAwayException extends ApplicationException {
  constructor() {
    super("Coordinates are too far away");
  }
}
