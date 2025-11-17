import { eq } from "drizzle-orm";
import type { Db } from "@/lib/db";
import {
	type Transaction,
	type TransactionSelect,
	transactions,
} from "../schema/schema";

export interface TransactionImpl {
	createTransaction: (
		transaction: Transaction,
	) => Promise<TransactionSelect | undefined>;
	getTransactions: () => Promise<TransactionSelect[]>;
	getUserTransactions: (userId: string) => Promise<TransactionSelect[]>;
}

export class TransactionRepo implements TransactionImpl {
	constructor(private readonly transactionStore: Db) {}

	async createTransaction(transaction: Transaction) {
		try {
			const data = await this.transactionStore
				.insert(transactions)
				.values(transaction)
				.returning();
			return data[0];
		} catch (error) {
			console.error(error);
			throw error;
		}
	}

	async getTransactions() {
		try {
			const data = await this.transactionStore.query.transactions.findMany();
			return data ?? [];
		} catch (error) {
			throw error;
		}
	}

	async getUserTransactions(userId: string) {
		try {
			const data = await this.transactionStore.query.transactions.findMany({
				where: eq(transactions.userId, userId),
			});
			return data ?? [];
		} catch (error) {
			throw error;
		}
	}
}
