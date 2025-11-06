import { type AuthEnv } from "./lib/auth";
export declare const routes: import("hono/hono-base").HonoBase<{
    Variables: AuthEnv;
}, ((import("hono/types").BlankSchema | import("hono/types").MergeSchemaPath<{
    "/accounts": {
        $post: {
            input: {
                json: Record<string, never>;
            };
            output: {
                message: {
                    name: string;
                    message: string;
                    stack?: string | undefined;
                    cause?: import("hono/utils/types").JSONValue | undefined;
                };
            };
            outputFormat: "json";
            status: 500;
        } | {
            input: {
                json: Record<string, never>;
            };
            output: {
                accountId: string | undefined;
                privateKey: {
                    [x: number]: number;
                    readonly BYTES_PER_ELEMENT: number;
                    readonly buffer: {
                        readonly byteLength: number;
                        slice: never;
                        readonly maxByteLength: number;
                        readonly resizable: boolean;
                        resize: never;
                        readonly detached: boolean;
                        transfer: never;
                        transferToFixedLength: never;
                    } | {
                        readonly byteLength: number;
                        slice: never;
                        readonly growable: boolean;
                        readonly maxByteLength: number;
                        grow: never;
                    };
                    readonly byteLength: number;
                    readonly byteOffset: number;
                    copyWithin: never;
                    every: never;
                    fill: never;
                    filter: never;
                    find: never;
                    findIndex: never;
                    forEach: never;
                    indexOf: never;
                    join: never;
                    lastIndexOf: never;
                    readonly length: number;
                    map: never;
                    reduce: never;
                    reduceRight: never;
                    set: never;
                    slice: never;
                    some: never;
                    sort: never;
                    subarray: never;
                    includes: never;
                    at: never;
                    findLast: never;
                    findLastIndex: never;
                    toSorted: never;
                    with: never;
                    toBase64: never;
                    setFromBase64: never;
                    setFromHex: never;
                };
                publicKey: {
                    [x: number]: number;
                    readonly BYTES_PER_ELEMENT: number;
                    readonly buffer: {
                        readonly byteLength: number;
                        slice: never;
                        readonly maxByteLength: number;
                        readonly resizable: boolean;
                        resize: never;
                        readonly detached: boolean;
                        transfer: never;
                        transferToFixedLength: never;
                    } | {
                        readonly byteLength: number;
                        slice: never;
                        readonly growable: boolean;
                        readonly maxByteLength: number;
                        grow: never;
                    };
                    readonly byteLength: number;
                    readonly byteOffset: number;
                    copyWithin: never;
                    every: never;
                    fill: never;
                    filter: never;
                    find: never;
                    findIndex: never;
                    forEach: never;
                    indexOf: never;
                    join: never;
                    lastIndexOf: never;
                    readonly length: number;
                    map: never;
                    reduce: never;
                    reduceRight: never;
                    set: never;
                    slice: never;
                    some: never;
                    sort: never;
                    subarray: never;
                    includes: never;
                    at: never;
                    findLast: never;
                    findLastIndex: never;
                    toSorted: never;
                    with: never;
                    toBase64: never;
                    setFromBase64: never;
                    setFromHex: never;
                };
            };
            outputFormat: "json";
            status: 201;
        };
    };
}, "/api"> | import("hono/types").MergeSchemaPath<{
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
}, "/api"> | import("hono/types").MergeSchemaPath<{
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
}, "/api"> | import("hono/types").MergeSchemaPath<{
    "/lookups/exchange": {
        $get: {
            input: {};
            output: {
                message: string;
            };
            outputFormat: "json";
            status: 500;
        } | {
            input: {};
            output: number;
            outputFormat: "json";
            status: import("hono/utils/http-status").ContentfulStatusCode;
        };
    };
}, "/api">) & {
    "/api/healthcheck": {
        $get: {
            input: {};
            output: {
                context: string;
                message: string;
            };
            outputFormat: "json";
            status: import("hono/utils/http-status").ContentfulStatusCode;
        };
    };
}) & {
    "/api/hello": {
        $get: {
            input: {};
            output: "Hello Hono!!!";
            outputFormat: "text";
            status: import("hono/utils/http-status").ContentfulStatusCode;
        };
    };
}, "/api">;
declare const _default: {
    fetch: (request: Request, Env?: unknown, executionCtx?: import("hono").ExecutionContext) => Response | Promise<Response>;
    websocket: import("hono/bun").BunWebSocketHandler<import("hono/bun").BunWebSocketData>;
};
export default _default;
