import Fastify from "fastify";

export const app = Fastify();

app.get("/", async () => {
  return { ok: true };
});
