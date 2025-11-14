import { Hono } from "hono";
import { describeRoute, resolver, validator } from "hono-openapi";
import z from "zod";
import type { AuthEnv } from "@/lib/auth";
import { db } from "@/lib/db";
import { PlanRepo } from "@/repo/plans";
import { PlanSchema, PlanSelectSchema } from "@/repo/schema/schema";
import { PlansService } from "@/services/plans";

export const plans = new Hono<{ Variables: AuthEnv }>()
	.basePath("/plans")
	.post(
		"/",
		describeRoute({
			description: "Create A saving plan",
			responses: {
				200: {
					description: "Create A saving plan",
					content: {
						"application/json": {
							schema: resolver(PlanSelectSchema),
						},
					},
				},
			},
		}),
		validator("json", PlanSchema),
		async (c) => {
			const user = c.get("user");
			const plan = c.req.valid("json");
			const planService = new PlansService(new PlanRepo(db));
			try {
				const data = await planService.createUserPlan({
					...plan,
					nextDueDate: plan.nextDueDate!,
					userId: user?.id!,
				});
				return c.json(data, 200);
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
	.get(
		"/",
		describeRoute({
			description: "Get users plan",
			responses: {
				200: {
					description: "Get users plan",
					content: {
						"application/json": {
							schema: resolver(
								z.object({
									data: PlanSelectSchema.array(),
									totalAmount: z.number(),
								}),
							),
						},
					},
				},
			},
		}),
		async (c) => {
			const user = c.get("user");
			const planService = new PlansService(new PlanRepo(db));
			try {
				const response = await planService.getUserPlan(user?.id!);
				return c.json(response);
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
		"/special",
		describeRoute({
			description: "Get users plan with trassaction",
			responses: {
				200: {
					description: "Get users plan",
					content: {
						"application/json": {
							schema: resolver(z.any()),
						},
					},
				},
			},
		}),
		async (c) => {
			const user = c.get("user");
			const planService = new PlansService(new PlanRepo(db));
			try {
				const response = await planService.getUserPlanWithT(user?.id!);
				return c.json(response);
			} catch (error) {
				if (error instanceof Error) {
					return c.json({ message: error.message }, 500);
				} else {
					return c.json({ message: "An error has Occured" }, 500);
				}
			}
		},
	);
