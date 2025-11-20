import { z } from "zod";

console.log(process.env.NODE_ENV);
export const envSchema = z
	.object({
		BETTER_AUTH_SECRET: z.string().optional(),
		BETTER_AUTH_URL: z.string().optional(),
		EXPO_PUBLIC_BASE_URL: z
			.string()
			.default(
				process.env.NODE_ENV === "development"
					? "https://strong-carefully-fly.ngrok-free.app"
					: "https://hederawise-570799636889.us-central1.run.app",
			),
		DB_URL: z.string().optional(),
		GMAIL_USER: z.string().optional(),
		GMAIL_PASS: z.string().optional(),
		GOOGLE_CLIENT_ID: z.string().optional(),
		GOOGLE_CLIENT_SECRET: z.string().optional(),
		OPERATOR_ID: z.string().optional(),
		OPERATOR_KEY: z.string().optional(),
		NODE_URL: z.string().optional(),
		TOKEN_ID: z.string().optional(),
		DB_KEY: z.string().optional(),
	})
	.readonly();

export const env = envSchema.parse(process.env);
