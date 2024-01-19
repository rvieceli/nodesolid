import { UnauthorizedException } from "@/core/exceptions/unauthorized.exception";
import { FastifyRequest } from "fastify";

export async function authGuardMiddleware(request: FastifyRequest) {
  try {
    await request.jwtVerify();
  } catch (err) {
    throw new UnauthorizedException();
  }
}
