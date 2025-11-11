import { createNextDueDate } from "@hederawise/shared/src/utils";
import { to } from "await-to-ts";
import { and, eq, lte } from "drizzle-orm";
import type { Db } from "@/lib/db";
import { type Plan, type PlanSelect, plans } from "../schema/schema";

export interface PlanImpl {
	createPlan: (plan: Plan) => Promise<PlanSelect | undefined>;
	getPlans: () => Promise<PlanSelect[]>;
	getPlan: (userid: string) => Promise<PlanSelect | undefined>;
	getScheduledPlans: () => Promise<PlanSelect[]>;
	updatePlan: (plan: Partial<Plan>) => Promise<PlanSelect>;
	updateNextDueDate: () => Promise<PlanSelect[] | undefined>;
}
export class PlanRepo implements PlanImpl {
	constructor(private readonly planStore: Db) {}

	private isTuple<T>(array: T[]): array is [T, ...T[]] {
		return array.length > 0;
	}
	async createPlan(plan: Plan) {
		const [error, data] = await to(
			this.planStore.insert(plans).values(plan).returning(),
		);
		if (error) {
			throw error;
		}
		return data[0];
	}
	async getPlans() {
		const [error, data] = await to(this.planStore.query.plans.findMany());
		if (error) {
			throw error;
		}
		return data ?? [];
	}
	async getPlan(userId: string) {
		const [error, data] = await to(
			this.planStore.query.plans.findFirst({
				where: eq(plans.userId, userId),
			}),
		);
		if (error) {
			throw error;
		}
		return data;
	}
	async getScheduledPlans() {
		const [error, data] = await to(
			this.planStore.query.plans.findMany({
				where: and(
					lte(plans.nextDueDate, new Date()),
					eq(plans.status, "active"),
				),
			}),
		);

		if (error) {
			throw error;
		}
		return data ?? [];
	}
	async updatePlan(plan: Partial<Plan>) {
		const [error, data] = await to(
			this.planStore
				.update(plans)
				.set(plan)
				.where(eq(plans.id, plan.id!))
				.returning(),
		);
		if (error) {
			throw error;
		}
		return data[0]!;
	}
	async updateNextDueDate() {
		const [error, data] = await to(this.getScheduledPlans());
		if (error) {
			throw error;
		}
		if (!data) return [];
		const queries = data.map((plan) =>
			this.planStore
				.update(plans)
				.set({
					nextDueDate: createNextDueDate(plan.interval, plan.nextDueDate),
				})
				.where(eq(plans.id, plan.id!))
				.returning(),
		);
		if (this.isTuple(queries)) {
			const [batchError, batch] = await to(this.planStore.batch(queries));
			if (batchError) {
				throw batchError;
			}
			return batch.flat();
		}
	}
}
