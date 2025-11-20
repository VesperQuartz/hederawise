import { db, type Tx } from "@/lib/db";
import type { RepoFactory } from "@/repo";
import type { Nest } from "@/repo/schema/schema";
import type { TokenService } from "../token";
import type { WalletService } from "../wallet";

export class NestService {
	constructor(
		private readonly factory: RepoFactory,
		private readonly tokenService?: TokenService,
		private readonly walletService?: WalletService,
	) {}
	async createNest(payload: Nest) {
		try {
			const wallet = await this.walletService?.getUserWallet({
				userId: payload.userId!,
			});
			if (!wallet) {
				console.error("Wallet not found");
				throw new Error("Wallet not found");
			}
			const token = this.tokenService?.tokenTransfer({
				amount: payload.amount!,
				userAccountId: wallet?.accountId,
				userPrivateKey: wallet?.privateKey,
			});
			if (!token) {
				console.error("Cannot transfer token");
				throw new Error("Cannot transfer token");
			}
			const transaction = db.transaction(async (tx) => {
				console.log("TX", tx);
				const nest = this.factory.createNestFactory(tx);
				const data = await nest.createNest(payload);
				const transaction = this.factory.createTransactionFactory(tx);
				await transaction.createNestTransaction({
					amount: payload.amount!,
					userId: payload.userId,
					nestId: data.id,
				});
				return { message: "Nest plan has been created" };
			});
			return transaction;
		} catch (error) {
			console.error("ERROR", error);
			if (error instanceof Error) {
				throw new Error(`Failed to create nest: ${error.message}`);
			}
			throw new Error("Failed to create nest");
		}
	}

	async getUserNest(userId: string) {
		const factory = this.factory.createNestFactory(db);
		const nest = await factory.getNextByUserId(userId);
		return nest;
	}
}
