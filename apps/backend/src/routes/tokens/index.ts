import to from "await-to-ts";
import { Hono } from "hono";
import { describeRoute, resolver, validator } from "hono-openapi";
import { z } from "zod";
import { type AuthEnv } from "@/lib/auth";
import { db } from "@/lib/db";
import { TokenSelectSchema } from "@/repo/schema/schema";
import { TokenStorage } from "@/repo/token";
import { WalletStorage } from "@/repo/wallet";
import { TokenService } from "@/services/token";
import { WalletService } from "@/services/wallet";

export const tokens = new Hono<{ Variables: AuthEnv }>()
	.basePath("/tokens")
	.get(
		"/",
		describeRoute({
			description: "Token",
			responses: {
				200: {
					description: "Token",
					content: {
						"application/json": {
							schema: resolver(TokenSelectSchema.array()),
						},
					},
				},
			},
		}),
		async (ctx) => {
			const user = ctx.get("user");
			if (user?.role !== "admin") {
				return ctx.json({ message: "This action is forbiden!!" }, 403);
			}
			const token = new TokenService(new TokenStorage(db));
			const [error, data] = await to(token.getAllToken());
			if (error) {
				ctx.json({ message: error.message }, 500);
			}
			return ctx.json(data);
		},
	)
	.post(
		"/",
		validator("json", z.object({})),
		describeRoute({
			description: "Token",
			responses: {
				200: {
					description: "Token",
					content: {
						"application/json": {
							schema: resolver(TokenSelectSchema),
						},
					},
				},
			},
		}),
		async (ctx) => {
			const token = new TokenService(new TokenStorage(db));
			const [error, data] = await to(token.createToken());
			if (error) {
				ctx.json({ message: error.message }, 500);
			}
			return ctx.json(data);
		},
	)
	.post(
		"/link",
		validator(
			"json",
			z.object({
				userAccountId: z.string(),
				userPrivateKey: z.array(z.number()),
			}),
		),
		describeRoute({
			description: "Token",
			responses: {
				200: {
					description: "Token",
					content: {
						"application/json": {
							schema: resolver(
								z.object({
									message: z.string(),
									accountId: z.string(),
									tokenId: z.string(),
								}),
							),
						},
					},
				},
			},
		}),
		async (ctx) => {
			const { userAccountId, userPrivateKey } = ctx.req.valid("json");
			const token = new TokenService(new TokenStorage(db));
			try {
				const data = await token.tokenLink({ userAccountId, userPrivateKey });
				return ctx.json(data);
			} catch (error) {
				console.error(error);
				return ctx.json({ message: `An error has Occured ${error}` }, 500);
			}
		},
	)
	.post(
		"/transfer",
		validator(
			"json",
			z.object({
				amount: z.number(),
			}),
		),
		describeRoute({
			description: "Token",
			responses: {
				200: {
					description: "Token",
					content: {
						"application/json": {
							schema: resolver(
								z.object({
									message: z.string(),
								}),
							),
						},
					},
				},
			},
		}),
		async (ctx) => {
			const user = ctx.get("user");
			const wallet = new WalletService(new WalletStorage(db));
			const { amount } = ctx.req.valid("json");
			const token = new TokenService(new TokenStorage(db));
			const userPrivateKey = await wallet.getUserWallet({ userId: user?.id! });
			const userAccountId = await wallet.getUserWallet({ userId: user?.id! });
			const [error, data] = await to(
				token.tokenTransfer({
					userAccountId: userAccountId?.accountId!,
					userPrivateKey: userPrivateKey?.privateKey!,
					amount,
				}),
			);
			if (error) {
				ctx.json({ message: error.message }, 500);
			}
			return ctx.json(data);
		},
	)

	.get(
		"/balance/:userAccountId",
		validator(
			"param",
			z.object({
				userAccountId: z.string(),
			}),
		),
		describeRoute({
			description: "Token",
			responses: {
				200: {
					description: "Token",
					content: {
						"application/json": {
							schema: resolver(z.number()),
						},
					},
				},
			},
		}),
		async (ctx) => {
			const { userAccountId } = ctx.req.valid("param");
			const token = new TokenService(new TokenStorage(db));
			const [error, data] = await to(
				token.getUserTokenBalance({ userAccountId }),
			);
			if (error) {
				console.error(error);
				return ctx.json({ message: error.message }, 500);
			}
			return ctx.json(data);
		},
	);
