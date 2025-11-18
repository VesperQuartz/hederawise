import { Hono } from "hono";
import { describeRoute, resolver, validator } from "hono-openapi";
import { z } from "zod";
import { type AuthEnv } from "@/lib/auth";
import { db } from "@/lib/db";
import { WalletSchema, WalletSelectSchema } from "@/repo/schema/schema";
import { WalletStorage } from "@/repo/wallet";
import { WalletService } from "@/services/wallet";

export const wallet = new Hono<{ Variables: AuthEnv }>()
	.basePath("/wallets")
	.post(
		"/",
		validator("json", WalletSchema),
		describeRoute({
			description: "Create user wallet",
			responses: {
				200: {
					description: "Create user wallet",
					content: {
						"application/json": {
							schema: resolver(
								z.string().describe("Equivalent of $1 -> 1 hbar"),
							),
						},
					},
				},
			},
		}),
		async (c) => {
			try {
				const payload = c.req.valid("json");
				const user = c.get("user");
				console.log("User", "user from API");
				const wallet = new WalletService(new WalletStorage(db));
				const data = await wallet.createUserWallet({
					...payload,
					userId: user?.id,
				});
				return c.json(data);
			} catch (error) {
				const message =
					error instanceof Error ? error.message : "An error occurred";
				return c.json({ message }, 500);
			}
		},
	)
	.get(
		"/",
		describeRoute({
			description: "Get user wallet",
			responses: {
				200: {
					description: "Get user wallet",
					content: {
						"application/json": {
							schema: resolver(WalletSelectSchema),
						},
					},
				},
			},
		}),
		async (c) => {
			try {
				const user = c.get("user");
				const wallet = new WalletService(new WalletStorage(db));
				const data = await wallet.getUserWallet({ userId: user!.id });
				return c.json(data ?? null);
			} catch (error) {
				console.error(error);
				const message =
					error instanceof Error ? error.message : "An error occurred";
				return c.json({ message }, 500);
			}
		},
	);
