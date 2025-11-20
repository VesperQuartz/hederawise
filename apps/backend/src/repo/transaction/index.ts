import { eq } from "drizzle-orm";
import type { Db } from "@/lib/db";
import {
	type NestTransaction,
	type NestTransactionSelect,
	nest_transactions,
	type Transaction,
	type TransactionSelect,
	transactions,
} from "../schema/schema";

export interface TransactionImpl {
	createTransaction: (
		transaction: Transaction,
	) => Promise<TransactionSelect | undefined>;
	createNestTransaction: (
		transaction: NestTransaction,
	) => Promise<NestTransactionSelect | undefined>;
	getNestTransactionByUserId(userId: string): Promise<NestTransactionSelect[]>;
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

	async createNestTransaction(transaction: NestTransaction) {
		const data = await this.transactionStore
			.insert(nest_transactions)
			.values(transaction)
			.returning();
		return data[0]!;
	}

	async getNestTransactionByUserId(userId: string) {
		const data = await this.transactionStore.query.nest_transactions.findMany({
			where: eq(nest_transactions.userId, userId),
		});
		return data!;
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
