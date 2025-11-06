import { type AuthEnv } from "@/src/lib/auth";
export declare const tokens: import("hono/hono-base").HonoBase<{
    Variables: AuthEnv;
}, {
    "/tokens": {
        $get: {
            input: {};
            output: {
                message: string;
            };
            outputFormat: "json";
            status: 403;
        } | {
            input: {};
            output: {
                id: number;
                createdAt: string | null;
                updatedAt: string | null;
                tokenId: string;
                tokenName: string;
                tokenSymbol: string;
                privateKey: number[];
            }[];
            outputFormat: "json";
            status: import("hono/utils/http-status").ContentfulStatusCode;
        };
    };
} & {
    "/tokens": {
        $post: {
            input: {
                json: Record<string, never>;
            };
            output: {
                tokenId: string | undefined;
                tokenName: string;
                tokenSymbol: string;
                privateKey: number[];
            };
            outputFormat: "json";
            status: import("hono/utils/http-status").ContentfulStatusCode;
        };
    };
} & {
    "/tokens/link": {
        $post: {
            input: {
                json: {
                    userAccountId: string;
                    userPrivateKey: number[];
                };
            };
            output: {
                tokenId: string | undefined;
                accountId: string | undefined;
                message: string;
            };
            outputFormat: "json";
            status: import("hono/utils/http-status").ContentfulStatusCode;
        } | {
            input: {
                json: {
                    userAccountId: string;
                    userPrivateKey: number[];
                };
            };
            output: {
                message: string;
            };
            outputFormat: "json";
            status: 500;
        };
    };
} & {
    "/tokens/transfer": {
        $post: {
            input: {
                json: {
                    userAccountId: string;
                    userPrivateKey: number[];
                    amount: number;
                };
            };
            output: {
                message: string;
            };
            outputFormat: "json";
            status: import("hono/utils/http-status").ContentfulStatusCode;
        };
    };
} & {
    "/tokens/balance/:userAccountId": {
        $get: {
            input: {
                param: {
                    userAccountId: string;
                };
            };
            output: any;
            outputFormat: "json";
            status: import("hono/utils/http-status").ContentfulStatusCode;
        };
    };
}, "/tokens">;
