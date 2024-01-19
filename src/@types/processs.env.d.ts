import type { Env } from "@/infra/env";

type RecordString<T extends Record<string, unknown>> = {
  [K in keyof T]: string;
};

declare global {
  namespace NodeJS {
    interface ProcessEnv extends RecordString<Env> {}
  }
}
