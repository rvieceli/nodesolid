import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { join } from "node:path";
import { Client } from "pg";

export async function migrateRun() {
  const client = new Client({
    host: process.env.POSTGRES_HOST,
    port: parseInt(process.env.POSTGRES_PORT || "5432"),
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
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
