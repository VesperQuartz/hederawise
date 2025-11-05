import to from "await-to-ts";
import { Hono } from "hono";
import { describeRoute, resolver, validator } from "hono-openapi";
import { z } from "zod";
import { type AuthEnv } from "@/lib/auth";
import { AccountService } from "@/services/account";
import { ApiService } from "@/services/api/index";

export const accounts = new Hono<{ Variables: AuthEnv }>()
	.basePath("/accounts")
	.post(
		"/",
		validator("json", z.object({})),
		describeRoute({
			description: "Create an account for users",
			responses: {
				201: {
					description: "Create an account for users",
					content: {
						"application/json": {
							schema: resolver(
								z
									.object({
										accountId: z.string().describe("Account Id"),
										privateKey: z.array(z.number()),
										publicKey: z.array(z.number()),
									})
									.describe("Create an account for users"),
							),
						},
					},
				},
			},
		}),
		async (c) => {
			const account = new AccountService(new ApiService());
			const [error, data] = await to(account.createAccount());
			if (error) {
				console.log(error);
				return c.json({ message: error }, 500);
			}
			return c.json(data, 201);
		},
	);
