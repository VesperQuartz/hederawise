import { z } from "zod";
export const envSchema = z
	.object({
		BETTER_AUTH_SECRET: z.string().optional(),
		BETTER_AUTH_URL: z.string().optional(),
		EXPO_PUBLIC_BASE_URL: z
			.string()
			.default("https://strong-carefully-fly.ngrok-free.app"),
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
