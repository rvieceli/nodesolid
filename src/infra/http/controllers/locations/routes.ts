import { FastifyInstance } from "fastify";

import { authGuardMiddleware } from "../../middleware/auth.guard";
import { roleGuardMiddleware } from "../../middleware/role.guard";

import { create } from "./create.controller";
import { search } from "./search.controller";
import { searchNearby } from "./search-nearby.controller";

export async function locationsRoutes(app: FastifyInstance) {
  app.addHook("onRequest", authGuardMiddleware);

  app.get("/search", search);
  app.get("/nearby", searchNearby);

  app.register(async function (adminOnly: FastifyInstance) {
    adminOnly.addHook("onRequest", roleGuardMiddleware("ADMIN"));

    adminOnly.post("/", create);
  });
}
