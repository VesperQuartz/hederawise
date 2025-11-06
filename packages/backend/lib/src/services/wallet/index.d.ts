import type { Wallet } from "@/src/repo/schema/schema";
import type { WalletImpl } from "@/src/repo/wallet";
export declare class WalletService {
    private readonly walletStore;
    constructor(walletStore: WalletImpl);
    createUserWallet(payload: Wallet): Promise<{
        id: number;
        createdAt: string | null;
        updatedAt: string | null;
        userId: string | null;
        accountId: string;
        privateKey: number[];
        publicKey: number[];
    } | undefined>;
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
