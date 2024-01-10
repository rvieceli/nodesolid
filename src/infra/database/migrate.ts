import { env } from "@/infra/env";
import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { join } from "node:path";
import { Client } from "pg";

export async function migrateRun() {
  const client = new Client({
    host: env.POSTGRES_HOST,
    port: env.POSTGRES_PORT,
    user: env.POSTGRES_USER,
    password: env.POSTGRES_PASSWORD,
    database: env.POSTGRES_DB,
  });

  try {
    await client.connect();

    const db = drizzle(client);

    await migrate(db, { migrationsFolder: join(__dirname, "./migrations") });
  } catch (e) {
    console.error(e);
  } finally {
    await client.end();
  }
}
