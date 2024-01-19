import { FastifyInstance } from "fastify";
import { register } from "./controllers/register.controller";
import { authenticate } from "./controllers/authenticate.controller";
import { profile } from "./controllers/profile.controller";
import { authGuardMiddleware } from "./middleware/auth.guard";

export async function appRoutes(app: FastifyInstance) {
  app.post("/users", register);
  app.post("/sessions", authenticate);

  app.register(authenticateRoutes);
}

export async function authenticateRoutes(app: FastifyInstance) {
  app.addHook("onRequest", authGuardMiddleware);

  app.get("/me", profile);
}
