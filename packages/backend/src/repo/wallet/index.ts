import to from "await-to-ts";
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
		const [error, data] = await to(
			this.db.insert(wallet).values(payload).returning(),
		);
		if (error) {
			console.error(error);
			throw error;
		}
		const [value] = data;
		return value!;
	}

	async getUserWallet({ userId }: { userId: string }) {
		const [error, data] = await to(
			this.db.query.wallet.findFirst({
				where: eq(wallet.userId, userId),
			}),
		);
		if (error) {
			console.error(error);
			throw error;
		}
		return data;
	}
}
