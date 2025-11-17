import { Hono } from "hono";
import { describeRoute, resolver, validator } from "hono-openapi";
import type { AuthEnv } from "@/lib/auth";
import { db } from "@/lib/db";
import {
	TransactionSchema,
	TransactionSelectSchema,
} from "@/repo/schema/schema";
import { TransactionRepo } from "@/repo/transaction";
import { TransactionsService } from "@/services/transactions";

export const transactions = new Hono<{ Variables: AuthEnv }>()
	.basePath("/transactions")
	.get(
		"/",
		describeRoute({
			description: "Get user transactions",
			responses: {
				200: {
					description: "Get user transactions",
					content: {
						"application/json": {
							schema: resolver(TransactionSelectSchema.array()),
						},
					},
				},
			},
		}),
		async (c) => {
			const user = c.get("user");
			const transaction = new TransactionsService(new TransactionRepo(db));
			try {
				const data = await transaction.getUserTransactions(user?.id!);
				return c.json(data);
			} catch (error) {
				console.error(error);
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
		validator("json", TransactionSchema),
		describeRoute({
			description: "Create tranaction for user",
			responses: {
				200: {
					description: "Create tranaction for user",
					content: {
						"application/json": {
							schema: resolver(TransactionSelectSchema),
						},
					},
				},
			},
		}),
		async (c) => {
			const payload = c.req.valid("json");
			const user = c.get("user");
			const transaction = new TransactionsService(new TransactionRepo(db));
			try {
				const data = await transaction.createTransaction({
					...payload,
					userId: user?.id!,
				});
				return c.json(data);
			} catch (error) {
				console.error(error);
				if (error instanceof Error) {
					return c.json({ message: error.message }, 500);
				} else {
					return c.json({ message: "An error has Occured" }, 500);
				}
			}
		},
	);
