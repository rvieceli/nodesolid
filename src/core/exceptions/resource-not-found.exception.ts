import { ApplicationException } from "./application.exception";

export class ResourceNotFoundException extends ApplicationException {
  resource: string;

  constructor(resource: string) {
    super(`${resource} not found`);
    this.resource = resource;
    this.statusCode = 404;
  }
}
