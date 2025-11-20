import { Hono } from "hono";
import { describeRoute, resolver, validator } from "hono-openapi";
import z from "zod";
import type { AuthEnv } from "@/lib/auth";
import { db } from "@/lib/db";
import { RepoFactory } from "@/repo";
import { NestSchema, NestSelectSchema } from "@/repo/schema/schema";
import { TokenStorage } from "@/repo/token";
import { WalletStorage } from "@/repo/wallet";
import { ApiService } from "@/services/api";
import { NestService } from "@/services/nest";
import { TokenService } from "@/services/token";
import { WalletService } from "@/services/wallet";

export const nest = new Hono<{ Variables: AuthEnv }>()
	.basePath("/nests")
	.get(
		"/",
		describeRoute({
			description: "Get User nest",
			responses: {
				200: {
					description: "Get User nest",
					content: {
						"application/json": {
							schema: resolver(NestSelectSchema),
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
	)
	.post(
		"/",
		describeRoute({
			description: "Create User nest",
			responses: {
				200: {
					description: "Create User nest",
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
		validator("json", NestSchema),
		async (c) => {
			const payload = c.req.valid("json");
			const user = c.get("user");
			const wallet = new WalletService(new WalletStorage(db));
			const nest = new NestService(
				new RepoFactory(),
				new TokenService(new TokenStorage(db), wallet),
				new WalletService(new WalletStorage(db)),
			);
			try {
				const data = await nest.createNest({
					...payload,
					userId: user?.id!,
				});
				return c.json(data);
			} catch (error) {
				console.error(error, "EEEEEE");
				if (error instanceof Error) {
					return c.json({ message: error.message }, 500);
				} else {
					return c.json({ message: "An error has Occured" }, 500);
				}
			}
		},
	);
