import {
	AccountBalance,
	type AccountBalanceJson,
	AccountBalanceQuery,
	PrivateKey,
	TokenAssociateTransaction,
	TokenCreateTransaction,
	TokenMintTransaction,
	TokenSupplyType,
	TokenType,
	TransferTransaction,
} from "@hashgraph/sdk";
import { env } from "@hederawise/shared/src/env";
import { client } from "@/lib/hedera";
import type { TokenImpl } from "@/repo/token";
import type { WalletImpl } from "@/repo/wallet";
import type { WalletService } from "../wallet";

export class TokenService {
	constructor(
		private readonly tokenStore: TokenImpl,
		private readonly walletStore?: WalletService,
	) {}

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

			try {
				await this.tokenStore.createToken({
					tokenId: tokenId as string,
					tokenName: "$HWISE",
					tokenSymbol: "HW",
					privateKey: Array.from(privateKey.toBytes()),
				});
			} catch (error) {
				const message =
					error instanceof Error ? error.message : "Cannot create token";
				console.error(message);
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
			throw e;
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
				.setTokenIds([env.TOKEN_ID!, "0.0.7248055"])
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
			const token = await this.tokenStore.getTokens();
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

	async getUserTokenBalance({
		userAccountId,
	}: {
		userAccountId: string;
	}): Promise<AccountBalanceJson> {
		try {
			const balance = await new AccountBalanceQuery()
				.setAccountId(userAccountId)
				.execute(client);
			return balance.toJSON();
		} catch (error) {
			console.log(error);
			throw error;
		}
	}
	async tokenTransferCron({
		userId,
		amount,
	}: {
		userId: string;
		amount: number;
	}) {
		try {
			const wallet = await this.walletStore?.getUserWallet({ userId });
			const balance = await this.getUserTokenBalance({
				userAccountId: wallet?.accountId!,
			});

			if (Number(balance.hbars.split(" ")[0]) < amount) {
				throw new Error("Not enough funds");
			}

			const data = await new TransferTransaction()
				.addHbarTransfer(wallet?.accountId!, -amount)
				.addHbarTransfer(env.OPERATOR_ID!, amount)
				.addTokenTransfer(env.TOKEN_ID!, env.OPERATOR_ID!, -amount)
				.addTokenTransfer(env.TOKEN_ID!, wallet?.accountId!, amount)
				.freezeWith(client)
				.sign(PrivateKey.fromBytesECDSA(Uint8Array.from(wallet?.privateKey!)));

			const recipt = (
				await (await data.execute(client)).getReceipt(client)
			).toJSON();
			return {
				status: recipt.status,
				serials: Number(recipt.serials[0]),
				accountId: recipt.accountId,
				tokenId: recipt.tokenId,
				topicId: recipt.topicId,
				message: `Successfully transfer ${recipt.status}`,
			};
		} catch (error) {
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
			const balance = await this.getUserTokenBalance({
				userAccountId,
			});

			if (Number(balance.hbars.split(" ")[0]) < amount) {
				throw new Error("Not enough funds");
			}

			const data = await new TransferTransaction()
				.addHbarTransfer(userAccountId, -amount)
				.addHbarTransfer(env.OPERATOR_ID!, amount)
				.addTokenTransfer(env.TOKEN_ID!, env.OPERATOR_ID!, -amount)
				.addTokenTransfer(env.TOKEN_ID!, userAccountId!, amount)
				.freezeWith(client)
				.sign(PrivateKey.fromBytesECDSA(Uint8Array.from(userPrivateKey)));

			const recipt = (
				await (await data.execute(client)).getReceipt(client)
			).toJSON();
			return {
				status: recipt.status,
				serials: Number(recipt.serials[0]),
				accountId: recipt.accountId,
				tokenId: recipt.tokenId,
				topicId: recipt.topicId,
				message: `Successfully transfer ${recipt.status}`,
			};
		} catch (error) {
			throw error;
		}
	}

	async tokenTransferFromStash({
		accountId,
		amount,
	}: {
		accountId: string;
		amount: number;
	}) {
		try {
			const data = await new TransferTransaction()
				.addHbarTransfer(env.OPERATOR_ID!, -amount)
				.addHbarTransfer(accountId, +amount)
				.freezeWith(client)
				.sign(PrivateKey.fromBytesECDSA(Uint8Array.from(env.OPERATOR_KEY!)));

			const recipt = (
				await (await data.execute(client)).getReceipt(client)
			).toJSON();
			return {
				status: recipt.status,
				serials: Number(recipt.serials[0]),
				accountId: recipt.accountId,
				tokenId: recipt.tokenId,
				topicId: recipt.topicId,
				message: `Successfully transfer ${recipt.status}`,
			};
		} catch (error) {
			throw error;
		}
	}

	async createNFT() {
		try {
			const privateKey = PrivateKey.fromStringECDSA(env.OPERATOR_KEY!);
			const tokenCreateTx = new TokenCreateTransaction()
				.setTokenName("$HWISENFT")
				.setTokenSymbol("HWNFT")
				.setTokenType(TokenType.NonFungibleUnique)
				.setDecimals(0)
				.setInitialSupply(0)
				.setTreasuryAccountId(env.OPERATOR_ID!)
				.setSupplyType(TokenSupplyType.Infinite)
				.setSupplyKey(privateKey)
				.freezeWith(client);

			const signedTx = await tokenCreateTx.sign(privateKey);
			const txResponse = await signedTx.execute(client);
			const receipt = await txResponse.getReceipt(client);
			const tokenId = receipt.tokenId?.toString();

			try {
				await this.tokenStore.createToken({
					tokenId: tokenId as string,
					tokenName: "$HWISENFT",
					tokenSymbol: "HWNFT",
					privateKey: Array.from(privateKey.toBytes()),
				});
			} catch (error) {
				const message =
					error instanceof Error ? error.message : "Cannot create token";
				console.error(message);
				throw new Error("Cannot create token");
			}

			return {
				tokenId,
				tokenName: "$HWISENFT",
				tokenSymbol: "HWNFT",
				privateKey: Array.from(privateKey.toBytes()),
			};
		} catch (e) {
			console.log(e);
			throw e;
		}
	}

	async mintNFT() {
		const CID = [
			Buffer.from(
				"bafkreieek4yrjdiit5upbbgtjrctgbat6sxmvun52mxvxoyrg32uroq3oy",
			),
		];
		console.log(CID);
		try {
			const mint = new TokenMintTransaction()
				.setTokenId("0.0.7248055")
				.setMetadata(CID)
				.freezeWith(client);

			const signedTx = await mint.sign(
				PrivateKey.fromStringECDSA(env.OPERATOR_KEY!),
			);

			const submitTx = await signedTx.execute(client);

			const receipt = (await submitTx.getReceipt(client)).toJSON();
			console.log(receipt);
			return {
				tokenId: receipt.tokenId,
				accountId: receipt.accountId,
				fieldId: receipt.filedId,
				serials: Number(receipt.serials.at(0)),
				status: receipt.status,
				message: `Successfully minted ${receipt.status}`,
			};
		} catch (error) {
			console.error(error);
			throw error;
		}
	}

	async nftTransfer({
		userAccountId,
		tokenSerial,
	}: {
		userAccountId: string;
		tokenSerial: number;
	}) {
		try {
			const tokenTransfer = await new TransferTransaction()
				.addNftTransfer(
					"0.0.7248055",
					tokenSerial,
					env.OPERATOR_ID!,
					userAccountId,
				)
				.freezeWith(client)
				.sign(PrivateKey.fromStringECDSA(env.OPERATOR_KEY!));

			const submit = await tokenTransfer.execute(client);
			const receipt = (await submit.getReceipt(client)).toJSON();
			return {
				serials: Number(receipt.serials[0]),
				accountId: receipt.accountId,
				tokenId: receipt.tokenId,
				fieldId: receipt.filedId,
				status: receipt.status,
				message: `Successfully transfer ${receipt.status}`,
			};
		} catch (error) {
			console.error(error);
			throw error;
		}
	}
}
