import "@fastify/jwt";
import type { Role } from "@/core/repositories/users.repository";

declare module "@fastify/jwt" {
  interface FastifyJWT {
    payload: { sub: string; role: Role };
  }
}
