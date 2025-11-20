import { Pool } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import type { PgQueryResultHKT, PgTransaction } from "drizzle-orm/pg-core";
import * as authschema from "@/repo/schema/auth.schema";
import * as schema from "@/repo/schema/schema";

const sql = new Pool({
	connectionString: process.env.DB_URL!,
	allowExitOnIdle: true,
});

export const db = drizzle({
	client: sql,
	schema: {
		...schema,
		...authschema,
	},
});

export type Db = typeof db;
export type Transaction = Parameters<
	Parameters<(typeof db)["transaction"]>[0]
>[0];

export type Tx = PgTransaction<PgQueryResultHKT>;
