import { AccountCreateTransaction, Hbar, PrivateKey } from "@hashgraph/sdk";
import { client } from "@/lib/hedera";
import type { ApiService } from "../api/index";

export class AccountService {
	private api: ApiService;
	constructor(api: ApiService) {
		this.api = api;
	}
	async createAccount() {
		const privateKey = PrivateKey.generateECDSA();
		const publicKey = privateKey.publicKey;
		const transaction = new AccountCreateTransaction()
			.setECDSAKeyWithAlias(publicKey)
			.setInitialBalance(10);
		const txResponse = await transaction.execute(client);
		const receipt = await txResponse.getReceipt(client);
		const accountId = receipt.accountId;
		client.close();
		return {
			accountId: accountId?.toString(),
			privateKey: privateKey.toBytes(),
			publicKey: publicKey.toBytes(),
		};
	}
}
