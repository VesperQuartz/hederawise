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
			try {
				const token = new TokenService(new TokenStorage(db));
				const data = await token.getAllToken();
				return ctx.json(data);
			} catch (error) {
				console.error(error);
				if (error instanceof Error) {
					return ctx.json({ message: error.message }, 500);
				}
			}
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
			try {
				const token = new TokenService(new TokenStorage(db));
				const data = await token.createToken();
				return ctx.json(data);
			} catch (error) {
				console.error(error);
				if (error instanceof Error) {
					return ctx.json({ message: error.message }, 500);
				}
			}
		},
	)
	.post(
		"/nft",
		validator("json", z.object({})),
		describeRoute({
			description: "NFT Token",
			responses: {
				200: {
					description: "NFT Token",
					content: {
						"application/json": {
							schema: resolver(TokenSelectSchema),
						},
					},
				},
			},
		}),
		async (ctx) => {
			try {
				const token = new TokenService(new TokenStorage(db));
				const data = await token.createNFT();
				return ctx.json(data);
			} catch (error) {
				console.error(error);
				if (error instanceof Error) {
					return ctx.json({ message: error.message }, 500);
				}
			}
		},
	)
	.post(
		"/nft/mint",
		validator("json", z.object({})),
		describeRoute({
			description: "NFT Token mint",
			responses: {
				200: {
					description: "NFT Token mint",
					content: {
						"application/json": {
							schema: resolver(TokenSelectSchema),
						},
					},
				},
			},
		}),
		async (ctx) => {
			try {
				const token = new TokenService(new TokenStorage(db));
				const data = await token.mintNFT();
				return ctx.json(data);
			} catch (error) {
				console.error(error);
				if (error instanceof Error) {
					return ctx.json({ message: error.message }, 500);
				}
			}
		},
	)
	.post(
		"/nft/transfer",
		validator(
			"json",
			z.object({
				tokenSerial: z.number(),
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
			try {
				const user = ctx.get("user");
				const wallet = new WalletService(new WalletStorage(db));
				const token = new TokenService(new TokenStorage(db));
				const { tokenSerial } = ctx.req.valid("json");
				const userAccountId = await wallet.getUserWallet({ userId: user?.id! });
				const data = await token.nftTransfer({
					userAccountId: userAccountId?.accountId!,
					tokenSerial: tokenSerial,
				});
				return ctx.json(data);
			} catch (error) {
				console.error(error);
				if (error instanceof Error) {
					return ctx.json({ message: error.message }, 500);
				}
			}
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
			try {
				const { userAccountId, userPrivateKey } = ctx.req.valid("json");
				const token = new TokenService(new TokenStorage(db));
				const data = await token.tokenLink({ userAccountId, userPrivateKey });
				return ctx.json(data);
			} catch (error) {
				console.error(error);
				if (error instanceof Error) {
					return ctx.json({ message: error.message }, 500);
				}
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
			try {
				const user = ctx.get("user");
				const wallet = new WalletService(new WalletStorage(db));
				const { amount } = ctx.req.valid("json");
				const token = new TokenService(new TokenStorage(db));
				const userPrivateKey = await wallet.getUserWallet({
					userId: user?.id!,
				});
				const userAccountId = await wallet.getUserWallet({ userId: user?.id! });
				const data = await token.tokenTransfer({
					userAccountId: userAccountId?.accountId!,
					userPrivateKey: userPrivateKey?.privateKey!,
					amount,
				});
				return ctx.json(data);
			} catch (error) {
				console.error(error);
				if (error instanceof Error) {
					return ctx.json({ message: error.message }, 500);
				}
			}
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
			description: "Token balance",
			responses: {
				200: {
					description: "Token balance",
					content: {
						"application/json": {
							schema: resolver(
								z.object({
									hbars: z.string(),
									tokens: z.array(
										z.object({
											tokenId: z.string(),
											balance: z.string(),
										}),
									),
								}),
							),
						},
					},
				},
			},
		}),
		async (ctx) => {
			try {
				const { userAccountId } = ctx.req.valid("param");
				const token = new TokenService(new TokenStorage(db));
				const data = await token.getUserTokenBalance({ userAccountId });
				return ctx.json(data);
			} catch (error) {
				console.error(error);
				if (error instanceof Error) {
					return ctx.json({ message: error.message }, 500);
				} else {
					return ctx.json({ message: "Something went wrong" }, 500);
				}
			}
		},
	);
