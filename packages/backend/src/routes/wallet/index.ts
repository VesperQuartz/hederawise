import to from "await-to-ts";
import { Hono } from "hono";
import { describeRoute, resolver, validator } from "hono-openapi";
import { z } from "zod";
import { type AuthEnv } from "@/lib/auth";
import { db } from "@/lib/db";
import { WalletService } from "@/services/wallet";
import { WalletSchema, WalletSelectSchema } from "@/src/repo/schema/schema";
import { WalletStorage } from "@/src/repo/wallet";

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
			const payload = c.req.valid("json");
			const user = c.get("user");
			console.log("User", "user from API");
			const wallet = new WalletService(new WalletStorage(db));
			const [error, data] = await to(
				wallet.createUserWallet({ ...payload, userId: user?.id }),
			);
			if (error) {
				return c.json({ message: error.message }, 500);
			}
			return c.json(data);
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
			const user = c.get("user");
			const wallet = new WalletService(new WalletStorage(db));
			try {
				const data = await wallet.getUserWallet({ userId: user!.id });
				console.log(data, "INSIDE");
				return c.json(data ?? null);
			} catch (error) {
				console.error(error);
				return c.json({ message: error }, 500);
			}
		},
	);
