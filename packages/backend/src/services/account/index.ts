import { AccountCreateTransaction, PrivateKey } from "@hashgraph/sdk";
import { client } from "@/src/lib/hedera";
import type { ApiService } from "../api/index";

export class AccountService {
	private api: ApiService;
	constructor(api: ApiService) {
		this.api = api;
	}
	async createAccount() {
		try {
			const privateKey = PrivateKey.generateECDSA();
			const publicKey = privateKey.publicKey;
			const transaction = new AccountCreateTransaction()
				.setECDSAKeyWithAlias(publicKey)
				.setInitialBalance(10)
				.freezeWith(client);
			const txResponse = await transaction.execute(client);
			const receipt = await txResponse.getReceipt(client);
			const accountId = receipt.accountId;
			return {
				accountId: accountId?.toString(),
				privateKey: privateKey.toBytes(),
				publicKey: publicKey.toBytes(),
			};
		} catch (error) {
			console.log(error);
			throw error;
		}
	}
}
