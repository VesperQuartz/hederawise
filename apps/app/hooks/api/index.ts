import { client } from "@hederawise/shared/src/client";
import {
	mutationOptions,
	queryOptions,
	useMutation,
	useQuery,
} from "@tanstack/react-query";
import type { InferRequestType } from "hono/client";
import { parseResponse } from "hono/client";
import { authClient } from "~/lib/auth-client";

export const userBalanceQueryOptions = ({
	token,
	accountId,
}: {
	token: string;
	accountId: string;
}) =>
	queryOptions({
		enabled: !!accountId,
		queryKey: ["userBalance", token, accountId],
		queryFn: async () => {
			const result = await parseResponse(
				client.api.tokens.balance[":userAccountId"].$get(
					{
						param: {
							userAccountId: accountId,
						},
					},
					{ headers: { Authorization: `Bearer ${token}` } },
				),
			);
			return result;
		},
	});

export const userWalletQueryOptions = ({ token }: { token: string }) =>
	queryOptions({
		queryKey: ["userWallet", token],
		queryFn: async () => {
			console.log(token, "TOKEN");
			const result = await parseResponse(
				client.api.wallets.$get(
					{},
					{ headers: { Authorization: `Bearer ${token}` } },
				),
			);
			return result;
		},
	});

export const getUserPlanWithTQueryOptions = ({ token }: { token: string }) =>
	queryOptions({
		queryKey: ["user__plan", token],
		queryFn: async () => {
			const result = await parseResponse(
				client.api.plans.special.$get(
					{},
					{ headers: { Authorization: `Bearer ${token}` } },
				),
			);
			return result;
		},
	});

export const exchangeQueryOptions = ({ token }: { token: string }) =>
	queryOptions({
		queryKey: ["exchange"],
		queryFn: async () => {
			const result = await parseResponse(
				client.api.lookups.exchange.$get(
					{},
					{ headers: { Authorization: `Bearer ${token}` } },
				),
			);
			return result;
		},
	});

export const planQueryOptions = ({ token }: { token: string }) =>
	queryOptions({
		queryKey: ["plan"],
		queryFn: async () => {
			const result = await parseResponse(
				client.api.plans.$get(
					{},
					{ headers: { Authorization: `Bearer ${token}` } },
				),
			);
			return result;
		},
	});

export const planQueryTOptions = ({ token }: { token: string }) =>
	queryOptions({
		queryKey: ["plan", "special"],
		queryFn: async () => {
			const result = await parseResponse(
				client.api.plans.special.$get(
					{},
					{ headers: { Authorization: `Bearer ${token}` } },
				),
			);
			return result;
		},
	});

export const planMutationOptions = ({ token }: { token: string }) =>
	mutationOptions({
		mutationKey: ["plan"],
		mutationFn: async (
			plan: InferRequestType<typeof client.api.plans.$post>["json"],
		) => {
			const result = await parseResponse(
				client.api.plans.$post(
					{
						json: plan,
					},
					{ headers: { Authorization: `Bearer ${token}` } },
				),
			);
			return result;
		},
	});

export const transactionMutationOption = ({ token }: { token: string }) =>
	mutationOptions({
		mutationKey: ["transaction"],
		mutationFn: async (
			transaction: InferRequestType<
				typeof client.api.transactions.$post
			>["json"],
		) => {
			const result = await parseResponse(
				client.api.transactions.$post(
					{
						json: transaction,
					},
					{ headers: { Authorization: `Bearer ${token}` } },
				),
			);
			return result;
		},
	});

export const tokenTransferMutationOption = ({ token }: { token: string }) =>
	mutationOptions({
		mutationKey: ["transaction", "token"],
		mutationFn: async (
			tokens: InferRequestType<typeof client.api.tokens.transfer.$post>["json"],
		) => {
			const result = await parseResponse(
				client.api.tokens.transfer.$post(
					{
						json: tokens,
					},
					{ headers: { Authorization: `Bearer ${token}` } },
				),
			);
			return result;
		},
	});

export const nftTransferMutationOption = ({ token }: { token: string }) =>
	mutationOptions({
		mutationKey: ["transaction", "nft"],
		mutationFn: async (
			nft: InferRequestType<
				typeof client.api.tokens.nft.transfer.$post
			>["json"],
		) => {
			const result = await parseResponse(
				client.api.tokens.nft.transfer.$post(
					{
						json: nft,
					},
					{ headers: { Authorization: `Bearer ${token}` } },
				),
			);
			return result;
		},
	});

export const mintTransferMutationOption = ({ token }: { token: string }) =>
	mutationOptions({
		mutationKey: ["transaction", "nft", "mint"],
		mutationFn: async (
			mint: InferRequestType<typeof client.api.tokens.nft.mint.$post>["json"],
		) => {
			const result = await parseResponse(
				client.api.tokens.nft.mint.$post(
					{
						json: mint,
					},
					{ headers: { Authorization: `Bearer ${token}` } },
				),
			);
			return result;
		},
	});

export const useGetBalance = () => {
	const session = authClient.useSession();
	const wallet = useQuery(
		userWalletQueryOptions({ token: session.data?.session.token! }),
	);
	const balance = useQuery(
		userBalanceQueryOptions({
			token: session.data?.session.token!,
			accountId: wallet.data?.accountId ?? "",
		}),
	);
	return {
		balance: Number(balance.data?.hbars.split(" ")[0] ?? 0),
		walletAddress: wallet.data?.accountId ?? "",
		hwise: Number(balance.data?.tokens[0].balance ?? 0),
	};
};

export const userStashQueryOptions = ({ token }: { token: string }) =>
	queryOptions({
		queryKey: ["stash"],
		queryFn: async () => {
			const result = await parseResponse(
				client.api.stash.$get(
					{},
					{ headers: { Authorization: `Bearer ${token}` } },
				),
			);
			return result;
		},
	});

export const createStashMutationOption = ({ token }: { token: string }) =>
	mutationOptions({
		mutationKey: ["stash"],
		mutationFn: async (
			stash: InferRequestType<typeof client.api.stash.$post>["json"],
		) => {
			const result = await parseResponse(
				client.api.stash.$post(
					{
						json: stash,
					},
					{ headers: { Authorization: `Bearer ${token}` } },
				),
			);
			return result;
		},
	});

export const withdrawStashMutationOption = ({ token }: { token: string }) =>
	mutationOptions({
		mutationKey: ["stash", "withdraw"],
		mutationFn: async (
			stash: InferRequestType<typeof client.api.stash.withdraw.$post>["json"],
		) => {
			const result = await parseResponse(
				client.api.stash.withdraw.$post(
					{
						json: stash,
					},
					{ headers: { Authorization: `Bearer ${token}` } },
				),
			);
			return result;
		},
	});

export const withdrawStashTokenMutationOption = ({
	token,
}: {
	token: string;
}) =>
	mutationOptions({
		mutationKey: ["stash", "withdraw", "token"],
		mutationFn: async (
			stash: InferRequestType<
				typeof client.api.tokens.withdraw.stash.$post
			>["json"],
		) => {
			const result = await parseResponse(
				client.api.tokens.withdraw.stash.$post(
					{
						json: stash,
					},
					{ headers: { Authorization: `Bearer ${token}` } },
				),
			);
			return result;
		},
	});

export const userStashTransactionsQueryOptions = ({
	token,
}: {
	token: string;
}) =>
	queryOptions({
		queryKey: ["stash", "transactions"],
		queryFn: async () => {
			const result = await parseResponse(
				client.api.stash.transactions.$get(
					{},
					{ headers: { Authorization: `Bearer ${token}` } },
				),
			);
			return result;
		},
	});

export const createStashTransactionMutationOption = ({
	token,
}: {
	token: string;
}) =>
	mutationOptions({
		mutationKey: ["stash", "transactions"],
		mutationFn: async (
			stash: InferRequestType<
				typeof client.api.stash.transactions.$post
			>["json"],
		) => {
			const result = await parseResponse(
				client.api.stash.transactions.$post(
					{
						json: stash,
					},
					{ headers: { Authorization: `Bearer ${token}` } },
				),
			);
			return result;
		},
	});
