import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { getDatabaseUrl } from "@/lib/env";
import * as schema from "./schema";

const globalForDb = globalThis as typeof globalThis & {
  postgresClient?: postgres.Sql;
};

export function getDb() {
  const client =
    globalForDb.postgresClient ??
    postgres(getDatabaseUrl(), {
      max: 5,
      prepare: false
    });

  if (process.env.NODE_ENV !== "production") {
    globalForDb.postgresClient = client;
  }

  return drizzle(client, { schema });
}
