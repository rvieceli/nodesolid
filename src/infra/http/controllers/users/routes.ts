import { FastifyInstance } from "fastify";
import { register } from "./register.controller";
import { authenticate } from "./authenticate.controller";
import { profile } from "./profile.controller";
import { authGuardMiddleware } from "../../middleware/auth.guard";
import { refreshToken } from "./refresh.controller";

export async function usersRoutes(app: FastifyInstance) {
  app.post("/register", register);
  app.post("/sessions", authenticate);
  app.patch("/sessions/refresh", refreshToken);

  app.register(async (authenticated) => {
    authenticated.addHook("onRequest", authGuardMiddleware);

    authenticated.get("/me", profile);
  });
}
