import type { AuthEnv } from "@/src/lib/auth";
export declare const lookups: import("hono/hono-base").HonoBase<{
    Variables: AuthEnv;
}, {
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
}, "/lookups">;
