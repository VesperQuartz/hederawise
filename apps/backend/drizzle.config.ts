import { env } from "@hederawise/shared/src/env";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
	schema: "./src/repo/schema",
	out: "./migrations",
	dialect: "postgresql",
	dbCredentials: {
		url: env.DB_URL!,
	},
});
