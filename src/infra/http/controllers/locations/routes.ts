import { FastifyInstance } from "fastify";
import { authGuardMiddleware } from "../../middleware/auth.guard";
import { create } from "./create.controller";
import { search } from "./search.controller";
import { searchNearby } from "./search-nearby.controller";

export async function locationsRoutes(app: FastifyInstance) {
  app.addHook("onRequest", authGuardMiddleware);

  app.post("/", create);
  app.get("/search", search);
  app.get("/nearby", searchNearby);
}
