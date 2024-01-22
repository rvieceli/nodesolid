import { RolePolicy } from "@/core/policies/role.policy";
import { Role } from "@/core/repositories/users.repository";
import { FastifyRequest } from "fastify";

export function roleGuardMiddleware(allowedRoles: Role | Role[]) {
  const policy = new RolePolicy(allowedRoles);

  return async function (request: FastifyRequest) {
    policy.isAllowedOrThrow(request.user.role);
  };
}
