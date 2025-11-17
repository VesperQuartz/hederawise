import { eq } from "drizzle-orm";
import type { Db } from "@/lib/db";
import {
	type Stash,
	type StashSelect,
	type StashTransaction,
	type StashTransactionSelect,
	stash,
	stashTransactions,
} from "../schema/schema";

export interface StashImpl {
	getUserStash(userId: string): Promise<StashSelect>;
	createStash(stash: Stash): Promise<StashSelect>;
	updateStashAmount(stashId: number, amount: number): Promise<StashSelect>;
	getUserStashTransactions(userId: string): Promise<StashTransactionSelect[]>;
	createStashTransaction(
		stashTransaction: StashTransaction,
	): Promise<StashTransactionSelect>;
}

export class StashStorage implements StashImpl {
	constructor(private readonly db: Db) {}

	async getUserStash(userId: string): Promise<any> {
		const result = await this.db.query.stash.findFirst({
			where: eq(stash.userId, userId),
		});
		return result;
	}

	async createStash(payload: Stash): Promise<StashSelect> {
		const data = await this.db.insert(stash).values(payload).returning();
		return data[0]!;
	}

	async updateStashAmount(
		stashId: number,
		amount: number,
	): Promise<StashSelect> {
		const data = await this.db
			.update(stash)
			.set({
				amount: amount,
			})
			.where(eq(stash.id, stashId))
			.returning();
		return data[0]!;
	}

	async getUserStashTransactions(userId: string) {
		const data = await this.db.query.stashTransactions.findMany({
			where: eq(stashTransactions.userId, userId),
		});
		return data;
	}

	async createStashTransaction(stashTransaction: StashTransaction) {
		const data = await this.db
			.insert(stashTransactions)
			.values(stashTransaction)
			.returning();
		return data[0]!;
	}
}
