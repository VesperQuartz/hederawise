import { AccountBalance } from "@hashgraph/sdk";
import type { TokenImpl } from "@/src/repo/token";
export declare class TokenService {
    private readonly tokenStore;
    constructor(tokenStore: TokenImpl);
    createToken(): Promise<{
        tokenId: string | undefined;
        tokenName: string;
        tokenSymbol: string;
        privateKey: number[];
    } | undefined>;
    tokenLink({ userAccountId, userPrivateKey, }: {
        userAccountId: string;
        userPrivateKey: Array<number>;
    }): Promise<{
        tokenId: string | undefined;
        accountId: string | undefined;
        message: string;
    }>;
    getAllToken(): Promise<{
        id: number;
        createdAt: string | null;
        updatedAt: string | null;
        tokenId: string;
        tokenName: string;
        tokenSymbol: string;
        privateKey: number[];
    }[]>;
    getTokenBalance({ accountBalance, tokenId, }: {
        accountBalance: AccountBalance;
        tokenId: string;
    }): Promise<any>;
    getUserTokenBalance({ userAccountId }: {
        userAccountId: string;
    }): Promise<any>;
    tokenTransfer({ userAccountId, userPrivateKey, amount, }: {
        userAccountId: string;
        userPrivateKey: Array<number>;
        amount: number;
    }): Promise<{
        message: string;
    }>;
}
