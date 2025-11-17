import { eq } from "drizzle-orm";
import type { Db } from "@/lib/db";
import { type Wallet, type WalletSelect, wallet } from "../schema/schema";

export type WalletImpl = {
	createWallet: (payload: Wallet) => Promise<WalletSelect>;
	getUserWallet: ({
		userId,
	}: {
		userId: string;
	}) => Promise<WalletSelect | undefined>;
};

export class WalletStorage implements WalletImpl {
	constructor(private readonly db: Db) {}

	async createWallet(payload: Wallet) {
		try {
			const data = await this.db.insert(wallet).values(payload).returning();
			const [value] = data;
			return value!;
		} catch (error) {
			console.error(error);
			throw error;
		}
	}

	async getUserWallet({ userId }: { userId: string }) {
		try {
			const data = await this.db.query.wallet.findFirst({
				where: eq(wallet.userId, userId),
			});
			return data;
		} catch (error) {
			console.error(error);
			throw error;
		}
	}
}
