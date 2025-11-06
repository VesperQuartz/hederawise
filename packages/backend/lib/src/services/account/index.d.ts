import type { ApiService } from "../api/index";
export declare class AccountService {
    private api;
    constructor(api: ApiService);
    createAccount(): Promise<{
        accountId: string | undefined;
        privateKey: Uint8Array<ArrayBufferLike>;
        publicKey: Uint8Array<ArrayBufferLike>;
    }>;
}
