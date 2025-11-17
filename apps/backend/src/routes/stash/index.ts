import { Hono } from "hono";
import { describeRoute, resolver, validator } from "hono-openapi";
import z from "zod";
import type { AuthEnv } from "@/lib/auth";
import { db } from "@/lib/db";
import {
	StashSchema,
	StashSelectSchema,
	StashTransactionSchema,
	StashTransactionSelectSchema,
} from "@/repo/schema/schema";
import { StashStorage } from "@/repo/stash";
import { StashService } from "@/services/stash";

export const stash = new Hono<{ Variables: AuthEnv }>()
	.basePath("/stash")
	.get(
		"/",
		describeRoute({
			description: "Get user stash $",
			responses: {
				200: {
					description: "Get user stash $",
					content: {
						"application/json": {
							schema: resolver(StashSelectSchema),
						},
					},
				},
			},
		}),
		async (c) => {
			const user = c.get("user");
			const stash = new StashService(new StashStorage(db));
			try {
				const data = await stash.getUserStash(user?.id!);
				return c.json(data);
			} catch (error) {
				if (error instanceof Error) {
					return c.json({ message: error.message }, 500);
				} else {
					return c.json({ message: "An error has Occured" }, 500);
				}
			}
		},
	)
	.post(
		"/",
		describeRoute({
			description: "Create user stash $",
			responses: {
				200: {
					description: "Create user stash $",
					content: {
						"application/json": {
							schema: resolver(StashSelectSchema),
						},
					},
				},
			},
		}),
		validator("json", StashSchema),
		async (c) => {
			const user = c.get("user");
			const payload = c.req.valid("json");
			const stash = new StashService(new StashStorage(db));
			try {
				const data = await stash.createStash({
					...payload,
					userId: user?.id!,
				});
				return c.json(data);
			} catch (error) {
				if (error instanceof Error) {
					return c.json({ message: error.message }, 500);
				} else {
					return c.json({ message: "An error has Occured" }, 500);
				}
			}
		},
	)
	.post(
		"/withdraw",
		describeRoute({
			description: "Withdraw from stash",
			responses: {
				200: {
					description: "Withdraw from stash",
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
		validator("json", z.object({ amount: z.coerce.number() })),
		async (c) => {
			const user = c.get("user");
			const stash = new StashService(new StashStorage(db));
			const { amount } = c.req.valid("json");
			try {
				await stash.withdrawFromStash(amount, user?.id!);
				return c.json({
					message: `Successfully withdrawn ${amount} from stash`,
				});
			} catch (error) {
				if (error instanceof Error) {
					return c.json({ message: error.message }, 500);
				} else {
					return c.json({ message: "An error has Occured" }, 500);
				}
			}
		},
	)
	.post(
		"/transfer",
		describeRoute({
			description: "Transfer to stash",
			responses: {
				200: {
					description: "Transfer to stash",
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
		validator("json", z.object({ amount: z.coerce.number() })),
		async (c) => {
			const user = c.get("user");
			const stash = new StashService(new StashStorage(db));
			const { amount } = c.req.valid("json");
			try {
				await stash.withdrawToStash(amount, user?.id!);
				return c.json({
					message: `Successfully transfered ${amount} to stash`,
				});
			} catch (error) {
				if (error instanceof Error) {
					return c.json({ message: error.message }, 500);
				} else {
					return c.json({ message: "An error has Occured" }, 500);
				}
			}
		},
	)
	.post(
		"/transactions",
		describeRoute({
			description: "Add transaction to stash",
			responses: {
				200: {
					description: "Add transaction to stash",
					content: {
						"application/json": {
							schema: resolver(StashTransactionSelectSchema),
						},
					},
				},
			},
		}),
		validator("json", StashTransactionSchema),
		async (c) => {
			const user = c.get("user");
			const payload = c.req.valid("json");
			const stash = new StashService(new StashStorage(db));
			try {
				const data = await stash.createStashTransaction({
					...payload,
					userId: user?.id!,
				});
				return c.json(data);
			} catch (error) {
				if (error instanceof Error) {
					return c.json({ message: error.message }, 500);
				} else {
					return c.json({ message: "An error has Occured" }, 500);
				}
			}
		},
	)
	.get(
		"/transactions",
		describeRoute({
			description: "get user stash transactions",
			responses: {
				200: {
					description: "get user stash transactions",
					content: {
						"application/json": {
							schema: resolver(StashTransactionSelectSchema.array()),
						},
					},
				},
			},
		}),
		async (c) => {
			const user = c.get("user");
			const stash = new StashService(new StashStorage(db));
			try {
				const data = await stash.getUserStashTransactions(user?.id!);
				return c.json(data);
			} catch (error) {
				if (error instanceof Error) {
					return c.json({ message: error.message }, 500);
				} else {
					return c.json({ message: "An error has Occured" }, 500);
				}
			}
		},
	);
