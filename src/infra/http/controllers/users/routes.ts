import { FastifyInstance } from "fastify";
import { register } from "./register.controller";
import { authenticate } from "./authenticate.controller";
import { profile } from "./profile.controller";
import { authGuardMiddleware } from "../../middleware/auth.guard";

export async function usersRoutes(app: FastifyInstance) {
  app.post("/register", register);
  app.post("/sessions", authenticate);

  app.register(async (authenticated) => {
    authenticated.addHook("onRequest", authGuardMiddleware);

    authenticated.get("/me", profile);
  });
}
