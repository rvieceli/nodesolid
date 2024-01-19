import "dotenv/config";

import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  PORT: z.coerce.number().default(3000),
  POSTGRES_USER: z.string(),
  POSTGRES_PASSWORD: z.string(),
  POSTGRES_DB: z.string(),
  POSTGRES_HOST: z.string(),
  POSTGRES_PORT: z.coerce.number().default(5432),
  JWT_SECRET: z.string(),
  JWT_EXPIRES_IN: z.string().default("1h"),
});

const validation = envSchema.safeParse(process.env);

if (!validation.success) {
  console.error(
    "Failed to parse environment variables",
    validation.error.format(),
  );
  throw new Error("Failed to parse environment variables");
}

export const env = validation.data;
