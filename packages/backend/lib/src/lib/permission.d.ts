export declare const ac: {
    newRole<K extends "user" | "session" | "project">(statements: import("better-auth/plugins/access").Subset<K, {
        readonly project: readonly ["create", "share", "update", "delete"];
        readonly user: readonly ["create", "list", "set-role", "ban", "impersonate", "delete", "set-password", "get", "update"];
        readonly session: readonly ["list", "revoke", "delete"];
    }>): {
        authorize<K_1 extends K>(request: K_1 extends infer T extends K_2 ? { [key in T]?: import("better-auth/plugins/access").Subset<K, {
            readonly project: readonly ["create", "share", "update", "delete"];
            readonly user: readonly ["create", "list", "set-role", "ban", "impersonate", "delete", "set-password", "get", "update"];
            readonly session: readonly ["list", "revoke", "delete"];
        }>[key] | {
            actions: import("better-auth/plugins/access").Subset<K, {
                readonly project: readonly ["create", "share", "update", "delete"];
                readonly user: readonly ["create", "list", "set-role", "ban", "impersonate", "delete", "set-password", "get", "update"];
                readonly session: readonly ["list", "revoke", "delete"];
            }>[key];
            connector: "OR" | "AND";
        } | undefined; } : never, connector?: "OR" | "AND"): import("better-auth/plugins/access").AuthorizeResponse;
        statements: import("better-auth/plugins/access").Subset<K, {
            readonly project: readonly ["create", "share", "update", "delete"];
            readonly user: readonly ["create", "list", "set-role", "ban", "impersonate", "delete", "set-password", "get", "update"];
            readonly session: readonly ["list", "revoke", "delete"];
        }>;
    };
    statements: {
        readonly project: readonly ["create", "share", "update", "delete"];
        readonly user: readonly ["create", "list", "set-role", "ban", "impersonate", "delete", "set-password", "get", "update"];
        readonly session: readonly ["list", "revoke", "delete"];
    };
};
export declare const adminRole: {
    authorize<K_1 extends "user" | "session" | "project">(request: K_1 extends infer T extends K ? { [key in T]?: import("better-auth/plugins/access").Subset<"user" | "session" | "project", {
        readonly project: readonly ["create", "share", "update", "delete"];
        readonly user: readonly ["create", "list", "set-role", "ban", "impersonate", "delete", "set-password", "get", "update"];
        readonly session: readonly ["list", "revoke", "delete"];
    }>[key] | {
        actions: import("better-auth/plugins/access").Subset<"user" | "session" | "project", {
            readonly project: readonly ["create", "share", "update", "delete"];
            readonly user: readonly ["create", "list", "set-role", "ban", "impersonate", "delete", "set-password", "get", "update"];
            readonly session: readonly ["list", "revoke", "delete"];
        }>[key];
        connector: "OR" | "AND";
    } | undefined; } : never, connector?: "OR" | "AND"): import("better-auth/plugins/access").AuthorizeResponse;
    statements: import("better-auth/plugins/access").Subset<"user" | "session" | "project", {
        readonly project: readonly ["create", "share", "update", "delete"];
        readonly user: readonly ["create", "list", "set-role", "ban", "impersonate", "delete", "set-password", "get", "update"];
        readonly session: readonly ["list", "revoke", "delete"];
    }>;
};
export declare const userRole: {
    authorize<K_1 extends "project">(request: K_1 extends infer T extends K ? { [key in T]?: import("better-auth/plugins/access").Subset<"project", {
        readonly project: readonly ["create", "share", "update", "delete"];
        readonly user: readonly ["create", "list", "set-role", "ban", "impersonate", "delete", "set-password", "get", "update"];
        readonly session: readonly ["list", "revoke", "delete"];
    }>[key] | {
        actions: import("better-auth/plugins/access").Subset<"project", {
            readonly project: readonly ["create", "share", "update", "delete"];
            readonly user: readonly ["create", "list", "set-role", "ban", "impersonate", "delete", "set-password", "get", "update"];
            readonly session: readonly ["list", "revoke", "delete"];
        }>[key];
        connector: "OR" | "AND";
    } | undefined; } : never, connector?: "OR" | "AND"): import("better-auth/plugins/access").AuthorizeResponse;
    statements: import("better-auth/plugins/access").Subset<"project", {
        readonly project: readonly ["create", "share", "update", "delete"];
        readonly user: readonly ["create", "list", "set-role", "ban", "impersonate", "delete", "set-password", "get", "update"];
        readonly session: readonly ["list", "revoke", "delete"];
    }>;
};
export declare const customRole: {
    authorize<K_1 extends "project">(request: K_1 extends infer T extends K ? { [key in T]?: import("better-auth/plugins/access").Subset<"project", {
        readonly project: readonly ["create", "share", "update", "delete"];
        readonly user: readonly ["create", "list", "set-role", "ban", "impersonate", "delete", "set-password", "get", "update"];
        readonly session: readonly ["list", "revoke", "delete"];
    }>[key] | {
        actions: import("better-auth/plugins/access").Subset<"project", {
            readonly project: readonly ["create", "share", "update", "delete"];
            readonly user: readonly ["create", "list", "set-role", "ban", "impersonate", "delete", "set-password", "get", "update"];
            readonly session: readonly ["list", "revoke", "delete"];
        }>[key];
        connector: "OR" | "AND";
    } | undefined; } : never, connector?: "OR" | "AND"): import("better-auth/plugins/access").AuthorizeResponse;
    statements: import("better-auth/plugins/access").Subset<"project", {
        readonly project: readonly ["create", "share", "update", "delete"];
        readonly user: readonly ["create", "list", "set-role", "ban", "impersonate", "delete", "set-password", "get", "update"];
        readonly session: readonly ["list", "revoke", "delete"];
    }>;
};
