import { type AuthEnv } from "@/src/lib/auth";
export declare const wallet: import("hono/hono-base").HonoBase<{
    Variables: AuthEnv;
}, {
    "/wallets": {
        $post: {
            input: {
                json: {
                    accountId: string;
                    privateKey: number[];
                    publicKey: number[];
                    id?: number | undefined;
                    userId?: string | null | undefined;
                    createdAt?: string | null | undefined;
                    updatedAt?: string | null | undefined;
                };
            };
            output: {
                message: string;
            };
            outputFormat: "json";
            status: 500;
        } | {
            input: {
                json: {
                    accountId: string;
                    privateKey: number[];
                    publicKey: number[];
                    id?: number | undefined;
                    userId?: string | null | undefined;
                    createdAt?: string | null | undefined;
                    updatedAt?: string | null | undefined;
                };
            };
            output: {
                id: number;
                createdAt: string | null;
                updatedAt: string | null;
                userId: string | null;
                accountId: string;
                privateKey: number[];
                publicKey: number[];
            };
            outputFormat: "json";
            status: import("hono/utils/http-status").ContentfulStatusCode;
        };
    };
} & {
    "/wallets": {
        $get: {
            input: {};
            output: {
                id: number;
                createdAt: string | null;
                updatedAt: string | null;
                userId: string | null;
                accountId: string;
                privateKey: number[];
                publicKey: number[];
            } | null;
            outputFormat: "json";
            status: import("hono/utils/http-status").ContentfulStatusCode;
        } | {
            input: {};
            output: {
                message: import("hono/utils/types").JSONValue;
            };
            outputFormat: "json";
            status: 500;
        };
    };
}, "/wallets">;
