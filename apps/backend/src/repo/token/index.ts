import type { Db } from "@/lib/db";
import { type Token, type TokenSelect, token } from "../schema/schema";

export type TokenImpl = {
	createToken: (payload: Token) => Promise<TokenSelect>;
	getTokens: () => Promise<TokenSelect[]>;
};

export class TokenStorage implements TokenImpl {
	constructor(private readonly db: Db) {}

	async createToken(payload: Token) {
		try {
			const data = await this.db.insert(token).values(payload).returning();
			const [value] = data;
			return value!;
		} catch (error) {
			console.error(error);
			throw error;
		}
	}

	async getTokens() {
		try {
			const data = await this.db.select().from(token);
			return data;
		} catch (error) {
			console.error(error);
			throw error;
		}
	}
}
