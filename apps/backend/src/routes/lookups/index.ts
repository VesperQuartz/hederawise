import to from "await-to-ts";
import { Hono } from "hono";
import { describeRoute, resolver } from "hono-openapi";
import { z } from "zod";
import type { AuthEnv } from "@/lib/auth";
import { ApiService } from "@/services/api";

export const lookups = new Hono<{ Variables: AuthEnv }>()
	.basePath("/lookups")
	.get(
		"/exchange",
		describeRoute({
			description: "Get exchange rate in $",
			responses: {
				200: {
					description: "Get exchange rate in $",
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
			const lookup = new ApiService();
			try {
				const data = await lookup.getExchangeRate();
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
