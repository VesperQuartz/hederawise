import { createNextDueDate } from "@hederawise/shared/src/utils";
import { to } from "await-to-ts";
import { and, eq, lte, sum } from "drizzle-orm";
import type { Db } from "@/lib/db";
import {
	type Plan,
	type PlanSelect,
	type PlanSelectWithT,
	plans,
	transactions,
} from "../schema/schema";

export interface PlanImpl {
	createPlan: (plan: Plan) => Promise<PlanSelect | undefined>;
	getPlans: () => Promise<PlanSelect[]>;
	getUserPlanWithTransactions: (userId: string) => Promise<PlanSelectWithT>;
	getPlan: (
		userid: string,
	) => Promise<{ data: PlanSelect[]; totalAmount: number } | undefined>;
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
		const sumValue = await this.planStore
			.select({ sum: sum(transactions.amount) })
			.from(transactions)
			.where(eq(transactions.userId, userId));
		const [error, data] = await to(
			this.planStore.query.plans.findMany({
				where: eq(plans.userId, userId),
			}),
		);
		if (error) {
			throw error;
		}
		return { data, totalAmount: Number(sumValue[0]?.sum) ?? 0 };
	}

	async getUserPlanWithTransactions(userId: string) {
		try {
			const result = await this.planStore.query.plans.findMany({
				where: eq(plans.userId, userId),
				with: {
					transactions: true,
				},
			});
			console.log(result);
			return result;
		} catch (error) {
			throw error;
		}
	}

	async getScheduledPlans() {
		const [error, data] = await to(
			this.planStore.query.plans.findMany({
				where: and(
					lte(plans.nextDueDate, new Date().toISOString()),
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
					nextDueDate: createNextDueDate(
						plan.interval,
						plan.nextDueDate,
					)?.toISOString(),
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
