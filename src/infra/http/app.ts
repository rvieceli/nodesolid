import Fastify from "fastify";
import fastifyJwt from "@fastify/jwt";
import { ZodError } from "zod";

import { env } from "../env";
import { appRoutes } from "./routes";
import { ApplicationException } from "@/core/exceptions/application.exception";

export const app = Fastify({
  logger: env.NODE_ENV === "development",
});

app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
  sign: {
    expiresIn: env.JWT_EXPIRES_IN,
  },
});
app.register(appRoutes);

app.setErrorHandler(function (error, request, reply) {
  if (error instanceof ApplicationException) {
    this.log.info(error, "application-exception");

    return reply //
      .status(error.statusCode)
      .send({
        error: error.name,
        message: error.message,
        statusCode: error.statusCode,
      });
  }

  if (error instanceof ZodError) {
    this.log.info(error, "validation-error");

    return reply //
      .status(400)
      .send({
        error: "ValidationError",
        message: "Validation failed",
        statusCode: 400,
        issues: error.issues,
      });
  }

  this.log.error(error);

  return reply //
    .status(500)
    .send({
      statusCode: 500,
      error: "Internal server error",
    });
});
