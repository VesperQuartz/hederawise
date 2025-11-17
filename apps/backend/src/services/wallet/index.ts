import type { Wallet } from "@/repo/schema/schema";
import type { WalletImpl } from "@/repo/wallet";

export class WalletService {
	constructor(private readonly walletStore: WalletImpl) {}

	async createUserWallet(payload: Wallet) {
		try {
			const data = await this.walletStore.createWallet(payload);
			return data;
		} catch (error) {
			console.error(error);
			throw error;
		}
	}

	async getUserWallet({ userId }: { userId: string }) {
		try {
			const data = await this.walletStore.getUserWallet({ userId });
			return data;
		} catch (error) {
			console.error(error);
			throw error;
		}
	}
}
