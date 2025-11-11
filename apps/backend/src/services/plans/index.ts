import { createNextDueDate } from "@hederawise/shared/src/utils";
import type { PlanImpl } from "@/repo/plans";
import type { Plan } from "@/repo/schema/schema";

export class PlansService {
	constructor(private readonly planStore: PlanImpl) {}
	async createUserPlan(plan: Plan) {
		try {
			const create = await this.planStore.createPlan({
				...plan,
				nextDueDate: createNextDueDate(plan.interval, new Date())!,
			});
			return create;
		} catch (error) {
			throw error;
		}
	}

	async getUserPlans() {
		try {
			const plans = await this.planStore.getPlans();
			return plans;
		} catch (error) {
			throw error;
		}
	}

	async getUserPlan(userId: string) {
		try {
			const plan = await this.planStore.getPlan(userId);
			return plan;
		} catch (error) {
			throw error;
		}
	}

	async getScheduledPlansToRun() {
		try {
			const plans = await this.planStore.getScheduledPlans();
			return plans;
		} catch (error) {
			throw error;
		}
	}

	async updatePlan(plan: Partial<Plan>) {
		try {
			const update = await this.planStore.updatePlan(plan);
			return update;
		} catch (error) {
			throw error;
		}
	}

	async updateNextDueDate() {
		try {
			const update = await this.planStore.updateNextDueDate();
			return update;
		} catch (error) {
			throw error;
		}
	}
}
