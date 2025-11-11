import { client } from "@hederawise/shared/src/client";
import { queryOptions } from "@tanstack/react-query";

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
			try {
				const response = await client.api.tokens.balance[":userAccountId"].$get(
					{
						param: {
							userAccountId: accountId,
						},
					},
					{ headers: { Authorization: `Bearer ${token}` } },
				);
				if (!response.ok) {
					throw new Error("Failed to fetch user balance");
				}
				const data = await response.json();
				return data;
			} catch (error) {
				console.error(error);
				throw error;
			}
		},
	});

export const userWalletQueryOptions = ({ token }: { token: string }) =>
	queryOptions({
		queryKey: ["userWallet", token],
		queryFn: async () => {
			try {
				const response = await client.api.wallets.$get(
					{},
					{ headers: { Authorization: `Bearer ${token}` } },
				);
				if (!response.ok) {
					throw new Error("Failed to fetch user wallet");
				}
				const data = await response.json();
				return data;
			} catch (error) {
				console.error(error);
				throw error;
			}
		},
	});

export const exchangeQueryOptions = ({ token }: { token: string }) =>
	queryOptions({
		queryKey: ["exchange"],
		queryFn: async () => {
			try {
				const response = await client.api.lookups.exchange.$get(
					{},
					{ headers: { Authorization: `Bearer ${token}` } },
				);
				if (!response.ok) {
					throw new Error("Failed to fetch exchange wallet");
				}
				const data = await response.json();
				return data;
			} catch (error) {
				console.error(error);
				throw error;
			}
		},
	});
