import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as authschema from "@/src/repo/schema/auth.schema";
import * as schema from "@/src/repo/schema/schema";

const sql = neon(process.env.DB_URL!);
export const db = drizzle({
	client: sql,
	schema: {
		...schema,
		...authschema,
	},
});

export type Db = typeof db;
