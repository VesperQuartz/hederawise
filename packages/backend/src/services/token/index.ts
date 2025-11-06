import {
	AccountBalance,
	AccountBalanceQuery,
	PrivateKey,
	TokenAssociateTransaction,
	TokenCreateTransaction,
	TokenSupplyType,
	TokenType,
	TransferTransaction,
} from "@hashgraph/sdk";
import { env } from "@hederawise/shared/env/env";
import to from "await-to-ts";
import { client } from "@/src/lib/hedera";
import type { TokenImpl } from "@/src/repo/token";

export class TokenService {
	constructor(private readonly tokenStore: TokenImpl) {}
	async createToken() {
		try {
			const privateKey = PrivateKey.fromStringECDSA(env.OPERATOR_KEY!);
			const tokenCreateTx = new TokenCreateTransaction()
				.setTokenName("$HWISE")
				.setTokenSymbol("HW")
				.setTokenType(TokenType.FungibleCommon)
				.setDecimals(2)
				.setInitialSupply(100_000)
				.setTreasuryAccountId(env.OPERATOR_ID!)
				.setSupplyType(TokenSupplyType.Infinite)
				.setSupplyKey(privateKey)
				.freezeWith(client);
			const signedTx = await tokenCreateTx.sign(privateKey);
			const txResponse = await signedTx.execute(client);
			const receipt = await txResponse.getReceipt(client);
			const tokenId = receipt.tokenId?.toString();
			client.close();
			const [error] = await to(
				this.tokenStore.createToken({
					tokenId: tokenId as string,
					tokenName: "$HWISE",
					tokenSymbol: "HW",
					privateKey: Array.from(privateKey.toBytes()),
				}),
			);
			if (error) {
				console.error(error.message);
				throw new Error("Cannot create token");
			}
			return {
				tokenId,
				tokenName: "$HWISE",
				tokenSymbol: "HW",
				privateKey: Array.from(privateKey.toBytes()),
			};
		} catch (e) {
			console.log(e);
		}
	}
	async tokenLink({
		userAccountId,
		userPrivateKey,
	}: {
		userAccountId: string;
		userPrivateKey: Array<number>;
	}) {
		try {
			const linking = new TokenAssociateTransaction()
				.setAccountId(userAccountId)
				.setTokenIds([env.TOKEN_ID!])
				.freezeWith(client);

			const signTx = await linking.sign(
				PrivateKey.fromBytes(Uint8Array.from(userPrivateKey)),
			);
			const response = await signTx.execute(client);

			const receipt = await response.getReceipt(client);
			return {
				tokenId: receipt.tokenId?.toString(),
				accountId: receipt.accountId?.toString(),
				message: `Successfully linked ${receipt.status}`,
			};
		} catch (e) {
			console.log(e);
			throw e;
		}
	}

	async getAllToken() {
		try {
			const [error, token] = await to(this.tokenStore.getTokens());
			if (error) {
				console.error(error);
				throw error;
			}
			return token;
		} catch (error) {
			console.error(error);
			throw error;
		}
	}

	async getTokenBalance({
		accountBalance,
		tokenId,
	}: {
		accountBalance: AccountBalance;
		tokenId: string;
	}) {
		try {
			return (
				accountBalance?.tokens?.get(tokenId) ??
				accountBalance?.tokens?.get(tokenId.toString()) ??
				0
			);
		} catch (error) {
			console.log(error);
			throw error;
		}
	}

	async getUserTokenBalance({ userAccountId }: { userAccountId: string }) {
		try {
			const [error, balance] = await to(
				new AccountBalanceQuery().setAccountId(userAccountId).execute(client),
			);
			if (error) {
				console.error(error);
				throw error;
			}
			const data = this.getTokenBalance({
				accountBalance: balance,
				tokenId: env.TOKEN_ID!,
			});
			return data;
		} catch (error) {
			console.log(error);
			throw error;
		}
	}

	async tokenTransfer({
		userAccountId,
		userPrivateKey,
		amount,
	}: {
		userAccountId: string;
		userPrivateKey: Array<number>;
		amount: number;
	}) {
		try {
			const [error, data] = await to(
				new TransferTransaction()
					.addHbarTransfer(userAccountId, -amount)
					.addHbarTransfer(env.OPERATOR_ID!, amount)
					.addTokenTransfer(env.TOKEN_ID!, env.OPERATOR_ID!, -amount)
					.addTokenTransfer(env.TOKEN_ID!, userAccountId!, amount)
					.freezeWith(client)
					.sign(PrivateKey.fromBytesECDSA(Uint8Array.from(userPrivateKey))),
			);
			if (error) {
				console.error(error);
				throw error;
			}
			const recipt = await (await data.execute(client)).getReceipt(client);
			return {
				message: `Successfully transfer ${recipt.status}`,
			};
		} catch (error) {
			console.error(error);
			throw error;
		}
	}
}
