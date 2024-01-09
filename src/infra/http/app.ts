import Fastify from "fastify";
import { env } from "../../env";
import { appRoutes } from "./routes";
import { ApplicationException } from "../../core/exceptions/application.exception";
import { ZodError } from "zod";

export const app = Fastify({
  logger: env.NODE_ENV === "development",
});

app.register(appRoutes);

app.setErrorHandler(function (error, request, reply) {
  if (error instanceof ApplicationException) {
    this.log.info(error, "apllication-exception");

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
