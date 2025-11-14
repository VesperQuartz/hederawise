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
import to from "await-to-ts";
import { client } from "@/lib/hedera";
import type { TokenImpl } from "@/repo/token";

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

	async getUserTokenBalance({
		userAccountId,
	}: {
		userAccountId: string;
	}): Promise<AccountBalanceJson> {
		try {
			const [error, balance] = await to(
				new AccountBalanceQuery().setAccountId(userAccountId).execute(client),
			);
			if (error) {
				console.error(error);
				throw error;
			}
			return balance.toJSON();
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
			const balance = await this.getUserTokenBalance({
				userAccountId,
			});

			if (Number(balance.hbars.split(" ")[0]) < amount) {
				throw new Error("Not enough funds");
			}

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

			const [error] = await to(
				this.tokenStore.createToken({
					tokenId: tokenId as string,
					tokenName: "$HWISENFT",
					tokenSymbol: "HWNFT",
					privateKey: Array.from(privateKey.toBytes()),
				}),
			);

			if (error) {
				console.error(error.message);
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
