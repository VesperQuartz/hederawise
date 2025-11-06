import type { Db } from "@/src/lib/db";
import { type Token, type TokenSelect } from "../schema/schema";
export type TokenImpl = {
    createToken: (payload: Token) => Promise<TokenSelect>;
    getTokens: () => Promise<TokenSelect[]>;
};
export declare class TokenStorage implements TokenImpl {
    private readonly db;
    constructor(db: Db);
    createToken(payload: Token): Promise<{
        id: number;
        createdAt: string | null;
        updatedAt: string | null;
        tokenId: string;
        tokenName: string;
        tokenSymbol: string;
        privateKey: number[];
    }>;
    getTokens(): Promise<{
        id: number;
        tokenId: string;
        tokenName: string;
        tokenSymbol: string;
        privateKey: number[];
        createdAt: string | null;
        updatedAt: string | null;
    }[]>;
}
