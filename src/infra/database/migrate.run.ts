import "dotenv/config";
import { migrateRun } from "./migrate";

for (let i = 2; i < process.argv.length; i++) {
  const [key, value] = process.argv[i].split("=");

  process.env[key] = value;
}

migrateRun().finally(() => {
  console.log("🫣 Database migrated");
});
