export declare const client: {
    api: {
        healthcheck: import("hono/client").ClientRequest<{
            $get: {
                input: {};
                output: {
                    context: string;
                    message: string;
                };
                outputFormat: "json";
                status: import("hono/utils/http-status").ContentfulStatusCode;
            };
        }>;
    };
} & {
    api: {
        hello: import("hono/client").ClientRequest<{
            $get: {
                input: {};
                output: "Hello Hono!!!";
                outputFormat: "text";
                status: import("hono/utils/http-status").ContentfulStatusCode;
            };
        }>;
    };
} & {
    api: {
        accounts: import("hono/client").ClientRequest<{
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
        }>;
    };
} & {
    api: {
        healthcheck: import("hono/client").ClientRequest<{
            $get: {
                input: {};
                output: {
                    context: string;
                    message: string;
                };
                outputFormat: "json";
                status: import("hono/utils/http-status").ContentfulStatusCode;
            };
        }>;
    };
} & {
    api: {
        hello: import("hono/client").ClientRequest<{
            $get: {
                input: {};
                output: "Hello Hono!!!";
                outputFormat: "text";
                status: import("hono/utils/http-status").ContentfulStatusCode;
            };
        }>;
    };
} & {
    api: {
        tokens: import("hono/client").ClientRequest<{
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
        }>;
    };
} & {
    api: {
        tokens: {
            link: import("hono/client").ClientRequest<{
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
            }>;
        };
    };
} & {
    api: {
        tokens: {
            transfer: import("hono/client").ClientRequest<{
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
            }>;
        };
    };
} & {
    api: {
        tokens: {
            balance: {
                ":userAccountId": import("hono/client").ClientRequest<{
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
                }>;
            };
        };
    };
} & {
    api: {
        healthcheck: import("hono/client").ClientRequest<{
            $get: {
                input: {};
                output: {
                    context: string;
                    message: string;
                };
                outputFormat: "json";
                status: import("hono/utils/http-status").ContentfulStatusCode;
            };
        }>;
    };
} & {
    api: {
        hello: import("hono/client").ClientRequest<{
            $get: {
                input: {};
                output: "Hello Hono!!!";
                outputFormat: "text";
                status: import("hono/utils/http-status").ContentfulStatusCode;
            };
        }>;
    };
} & {
    api: {
        wallets: import("hono/client").ClientRequest<{
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
        }>;
    };
} & {
    api: {
        healthcheck: import("hono/client").ClientRequest<{
            $get: {
                input: {};
                output: {
                    context: string;
                    message: string;
                };
                outputFormat: "json";
                status: import("hono/utils/http-status").ContentfulStatusCode;
            };
        }>;
    };
} & {
    api: {
        hello: import("hono/client").ClientRequest<{
            $get: {
                input: {};
                output: "Hello Hono!!!";
                outputFormat: "text";
                status: import("hono/utils/http-status").ContentfulStatusCode;
            };
        }>;
    };
} & {
    api: {
        lookups: {
            exchange: import("hono/client").ClientRequest<{
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
            }>;
        };
    };
} & {
    api: {
        healthcheck: import("hono/client").ClientRequest<{
            $get: {
                input: {};
                output: {
                    context: string;
                    message: string;
                };
                outputFormat: "json";
                status: import("hono/utils/http-status").ContentfulStatusCode;
            };
        }>;
    };
} & {
    api: {
        hello: import("hono/client").ClientRequest<{
            $get: {
                input: {};
                output: "Hello Hono!!!";
                outputFormat: "text";
                status: import("hono/utils/http-status").ContentfulStatusCode;
            };
        }>;
    };
};
