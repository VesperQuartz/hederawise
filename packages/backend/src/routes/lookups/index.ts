import to from "await-to-ts";
import { Hono } from "hono";
import { describeRoute, resolver } from "hono-openapi";
import { z } from "zod";
import type { AuthEnv } from "@/src/lib/auth";
import { ApiService } from "@/src/services/api";

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
			const [error, data] = await to(lookup.getExchangeRate());
			if (error) {
				return c.json({ message: error.message }, 500);
			}
			return c.json(data);
		},
	);
