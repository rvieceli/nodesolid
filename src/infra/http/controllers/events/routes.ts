import { FastifyInstance } from "fastify";
import { authGuardMiddleware } from "../../middleware/auth.guard";

import { create } from "./create.controller";
import { validate } from "./validate.controller";
import { metrics } from "./metrics.controller";
import { history } from "./history.controller";

export async function eventsRoutes(app: FastifyInstance) {
  app.addHook("onRequest", authGuardMiddleware);

  app.post("/:locationId/check-in", create);
  app.patch("/:eventId/validate", validate);
}
