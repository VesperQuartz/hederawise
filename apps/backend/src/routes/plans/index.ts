import { Hono } from "hono";
import { describeRoute, resolver, validator } from "hono-openapi";
import type { AuthEnv } from "@/lib/auth";
import { db } from "@/lib/db";
import { PlanRepo } from "@/repo/plans";
import { PlanSchema, PlanSelectSchema } from "@/repo/schema/schema";
import { PlansService } from "@/services/plans";

export const plans = new Hono<{ Variables: AuthEnv }>().basePath("/plans").post(
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
		const plan = c.req.valid("json");
		const planService = new PlansService(new PlanRepo(db));
		try {
			const data = await planService.createUserPlan({
				...plan,
				nextDueDate: new Date(plan.nextDueDate!),
			});
			return c.json(data);
		} catch (error) {
			if (error instanceof Error) {
				return c.json({ message: error.message }, 500);
			}
		}
	},
);
