import { type AuthEnv } from "@/src/lib/auth";
export declare const accounts: import("hono/hono-base").HonoBase<{
    Variables: AuthEnv;
}, {
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
}, "/accounts">;
