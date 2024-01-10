import { app } from "./infra/http/app";
import { env } from "./infra/env";
import { migrateRun } from "./infra/database/migrate";

async function start() {
  if (env.NODE_ENV === "development") {
    await migrateRun();
  }

  return app.listen({
    port: env.PORT,
    host: "0.0.0.0",
  });
}

start().then((address) => {
  console.log(`🫣 Server listening at ${address}`);
});
