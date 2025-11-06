import to from "await-to-ts";
import type { Wallet } from "@/src/repo/schema/schema";
import type { WalletImpl } from "@/src/repo/wallet";

export class WalletService {
	constructor(private readonly walletStore: WalletImpl) {}
	async createUserWallet(payload: Wallet) {
		try {
			const [error, data] = await to(this.walletStore.createWallet(payload));
			if (error) {
				console.error(error);
				throw error;
			}
			return data;
		} catch (e) {
			console.error(e);
		}
	}
	async getUserWallet({ userId }: { userId: string }) {
		try {
			const [error, data] = await to(
				this.walletStore.getUserWallet({ userId }),
			);
			if (error) {
				console.error(error);
				throw error;
			}
			return data;
		} catch (e) {
			console.error(e);
		}
	}
}
