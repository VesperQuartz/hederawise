import type { AccountId } from "@hashgraph/sdk";
import { env } from "@hederawise/shared/env/env";
import { to } from "await-to-ts";
import ky from "ky";

export class ApiService {
	async getAccountInfo(accountId: AccountId | null) {
		const [error, response] = await to(
			ky(`${env.NODE_URL}/account.id=${accountId}`, {
				timeout: false,
			}),
		);
		if (error) {
			console.log(error);
			throw new Error(error.message);
		}
		return response.json<any>();
	}
	async getExchangeRate() {
		const [error, response] = await to(
			ky(`https://mainnet.mirrornode.hedera.com/api/v1/network/exchangerate`, {
				timeout: false,
			}),
		);
		if (error) {
			console.log(error);
			throw new Error(error.message);
		}
		const data = await response.json<{
			timestamp: string;
			current_rate: {
				cent_equivalent: number;
				expiration_time: number;
				hbar_equivalent: number;
			};
		}>();
		const hbar =
			data.current_rate.cent_equivalent /
			data.current_rate.hbar_equivalent /
			100;
		return hbar;
	}
}
