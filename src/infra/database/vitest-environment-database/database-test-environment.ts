import "dotenv/config";
import { randomUUID } from "crypto";
import { Environment } from "vitest";
import { execSync } from "child_process";
import { Client } from "pg";

async function runCommand(sql: string) {
  const client = new Client({
    host: process.env.POSTGRES_HOST,
    port: parseInt(process.env.POSTGRES_PORT || "5432"),
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
  });

  try {
    await client.connect();

    await client.query(sql);
  } catch (e) {
    console.error(e);
  } finally {
    await client.end();
  }
}

export default {
  name: "database",
  transformMode: "ssr",
  async setup() {
    const sourceDb = process.env.POSTGRES_DB;
    const targetDb = `test_db_${randomUUID().replace(/-/g, "_")}`;

    await runCommand(`CREATE DATABASE ${targetDb};`);

    process.env.POSTGRES_DB = targetDb;

    execSync(`npm run migrate:run -- POSTGRES_DB=${targetDb}`);

    return {
      async teardown() {
        process.env.POSTGRES_DB = sourceDb;
        await runCommand(`
          SELECT pg_terminate_backend(pg_stat_activity.pid)
          FROM pg_stat_activity
          WHERE pg_stat_activity.datname = '${targetDb}'
        `);
        await runCommand(`DROP DATABASE IF EXISTS ${targetDb};`);
      },
    };
  },
} satisfies Environment;
