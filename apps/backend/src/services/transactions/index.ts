import type { Transaction } from "@/repo/schema/schema";
import type { TransactionImpl } from "@/repo/transaction";

export class TransactionsService {
	constructor(private readonly transactionStore: TransactionImpl) {}
	async createTransaction(transaction: Transaction) {
		try {
			const response =
				await this.transactionStore.createTransaction(transaction);
			return response;
		} catch (error) {
			console.error(error);
			throw error;
		}
	}
	async getTransactions() {
		try {
			const response = await this.transactionStore.getTransactions();
			return response;
		} catch (error) {
			console.error(error);
			throw error;
		}
	}

	async getUserTransactions(userId: string) {
		try {
			const response = await this.transactionStore.getUserTransactions(userId);
			return response;
		} catch (error) {
			console.error(error);
			throw error;
		}
	}
}
