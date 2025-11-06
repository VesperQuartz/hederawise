import type { AccountId } from "@hashgraph/sdk";
export declare class ApiService {
    getAccountInfo(accountId: AccountId | null): Promise<any>;
    getExchangeRate(): Promise<number>;
}
