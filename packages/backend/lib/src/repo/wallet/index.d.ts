import type { Db } from "@/src/lib/db";
import { type Wallet, type WalletSelect } from "../schema/schema";
export type WalletImpl = {
    createWallet: (payload: Wallet) => Promise<WalletSelect>;
    getUserWallet: ({ userId, }: {
        userId: string;
    }) => Promise<WalletSelect | undefined>;
};
export declare class WalletStorage implements WalletImpl {
    private readonly db;
    constructor(db: Db);
    createWallet(payload: Wallet): Promise<{
        id: number;
        createdAt: string | null;
        updatedAt: string | null;
        userId: string | null;
        accountId: string;
        privateKey: number[];
        publicKey: number[];
    }>;
    getUserWallet({ userId }: {
        userId: string;
    }): Promise<{
        id: number;
        createdAt: string | null;
        updatedAt: string | null;
        userId: string | null;
        accountId: string;
        privateKey: number[];
        publicKey: number[];
    } | undefined>;
}
