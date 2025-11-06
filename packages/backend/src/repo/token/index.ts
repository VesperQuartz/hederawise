import to from "await-to-ts";
import type { Db } from "@/src/lib/db";
import { type Token, type TokenSelect, token } from "../schema/schema";

export type TokenImpl = {
	createToken: (payload: Token) => Promise<TokenSelect>;
	getTokens: () => Promise<TokenSelect[]>;
};

export class TokenStorage implements TokenImpl {
	constructor(private readonly db: Db) {}
	async createToken(payload: Token) {
		const [error, data] = await to(
			this.db.insert(token).values(payload).returning(),
		);
		if (error) {
			console.error(error);
			throw error;
		}
		const [value] = data;
		return value!;
	}

	async getTokens() {
		const [error, data] = await to(this.db.select().from(token));
		if (error) {
			console.error(error);
			throw error;
		}
		return data;
	}
}
