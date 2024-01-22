import { ForbiddenException } from "../exceptions/forbidden.exception";
import { Role } from "../repositories/users.repository";

export class RolePolicy {
  constructor(private readonly allowedRoles: Role | Role[]) {}

  isAllowed(userRole: Role): boolean {
    return this.allowedRoles.includes(userRole);
  }

  isAllowedOrThrow(userRole: Role): void {
    if (!this.isAllowed(userRole)) {
      throw new ForbiddenException();
    }
  }
}
