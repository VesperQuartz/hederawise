import { createNextDueDate } from "@hederawise/shared/src/utils";
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
	getDuePlans: () => Promise<PlanSelect[]>;
	updatePlan: (plan: Partial<Plan>) => Promise<PlanSelect>;
	updatePlanStatus: (
		planId: number,
		status: "active" | "paused" | "completed" | "cancelled",
	) => Promise<PlanSelect>;
	updateNextDueDate: () => Promise<PlanSelect[] | undefined>;
}

export class PlanStorage implements PlanImpl {
	constructor(private readonly planStore: Db) {}

	private isTuple<T>(array: T[]): array is [T, ...T[]] {
		return array.length > 0;
	}

	async createPlan(plan: Plan) {
		try {
			const data = await this.planStore.insert(plans).values(plan).returning();
			return data[0];
		} catch (error) {
			throw error;
		}
	}

	async getPlans() {
		try {
			const data = await this.planStore.query.plans.findMany();
			return data ?? [];
		} catch (error) {
			throw error;
		}
	}

	async getPlan(userId: string) {
		try {
			const sumValue = await this.planStore
				.select({ sum: sum(transactions.amount) })
				.from(transactions)
				.where(eq(transactions.userId, userId));

			const data = await this.planStore.query.plans.findMany({
				where: eq(plans.userId, userId),
			});

			return { data, totalAmount: Number(sumValue[0]?.sum) ?? 0 };
		} catch (error) {
			throw error;
		}
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
		try {
			const data = await this.planStore.query.plans.findMany({
				where: and(
					lte(plans.nextDueDate, new Date().toISOString()),
					eq(plans.status, "active"),
				),
			});
			return data ?? [];
		} catch (error) {
			throw error;
		}
	}

	async getDuePlans() {
		try {
			const data = await this.planStore.query.plans.findMany({
				where: and(
					lte(plans.dueDate, new Date().toISOString()),
					eq(plans.status, "active"),
				),
			});
			return data ?? [];
		} catch (error) {
			throw error;
		}
	}

	async updatePlanStatus(
		planId: number,
		status: "active" | "paused" | "completed" | "cancelled",
	) {
		try {
			const data = await this.planStore
				.update(plans)
				.set({
					status,
				})
				.where(eq(plans.id, planId))
				.returning();
			return data[0]!;
		} catch (error) {
			throw error;
		}
	}

	async updatePlan(plan: Partial<Plan>) {
		try {
			const data = await this.planStore
				.update(plans)
				.set(plan)
				.where(eq(plans.id, plan.id!))
				.returning();
			return data[0]!;
		} catch (error) {
			throw error;
		}
	}

	async updateNextDueDate() {
		try {
			const data = await this.getScheduledPlans();
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
				const batch = await this.planStore.batch(queries);
				return batch.flat();
			}
		} catch (error) {
			throw error;
		}
	}
}
