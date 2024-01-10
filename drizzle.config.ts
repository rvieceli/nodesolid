import { env } from "@/infra/env";
import type { Config } from "drizzle-kit";

export default {
  schema: "./src/infra/database/schema.ts",
  out: "./src/infra/database/migrations",
  driver: "pg",
  dbCredentials: {
    host: "localhost",
    port: env.POSTGRES_PORT,
    user: env.POSTGRES_USER,
    password: env.POSTGRES_PASSWORD,
    database: env.POSTGRES_DB,
  },
} satisfies Config;
