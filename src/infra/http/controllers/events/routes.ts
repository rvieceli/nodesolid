import { FastifyInstance } from "fastify";
import { authGuardMiddleware } from "../../middleware/auth.guard";

import { create } from "./create.controller";
import { validate } from "./validate.controller";
import { metrics } from "./metrics.controller";
import { history } from "./history.controller";
import { roleGuardMiddleware } from "../../middleware/role.guard";

export async function eventsRoutes(app: FastifyInstance) {
  app.addHook("onRequest", authGuardMiddleware);

  app.post("/:locationId/check-in", create);
  app.get("/metrics", metrics);
  app.get("/history", history);

  app.register(async function (adminOnly: FastifyInstance) {
    adminOnly.addHook("onRequest", roleGuardMiddleware("ADMIN"));

    adminOnly.patch("/:eventId/validate", validate);
  });
}
