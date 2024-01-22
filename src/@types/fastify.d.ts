import { FastifyJwtNamespace } from "@fastify/jwt";

declare module "fastify" {
  interface FastifyInstance
    extends FastifyJwtNamespace<{ namespace: "refreshToken" }> {}

  interface FastifyRequest {
    refreshTokenJwtVerify: FastifyRequest["jwtVerify"];
    refreshTokenJwtDecode: FastifyRequest["jwtDecode"];
  }

  interface FastifyReply {
    refreshTokenJwtSign: FastifyReply["jwtSign"];
  }
}
