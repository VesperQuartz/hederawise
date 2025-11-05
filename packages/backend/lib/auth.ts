import { expo } from "@better-auth/expo";
import { env } from "@hederawise/shared/env/env";
import to from "await-to-ts";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import {
	admin,
	bearer,
	createAuthMiddleware,
	haveIBeenPwned,
	openAPI,
} from "better-auth/plugins";
import { MailServer } from "@/services/mail";
import { db } from "./db";
import { transporter } from "./mail";
import { ac, adminRole, customRole, userRole } from "./permission";

export const auth = betterAuth({
	baseURL: env.BETTER_AUTH_URL,
	rateLimit: {
		window: 10,
		max: 100,
		enabled: true,
	},
	socialProviders: {
		google: {
			clientId: env.GOOGLE_CLIENT_ID!,
			clientSecret: env.GOOGLE_CLIENT_SECRET,
			disableImplicitSignUp: true,
		},
	},
	database: drizzleAdapter(db, {
		provider: "pg",
	}),
	trustedOrigins: ["hederawise://"],
	plugins: [
		expo(),
		admin({
			ac,
			roles: {
				admin: adminRole,
				user: userRole,
				custom: customRole,
			},
			defaultRole: "user",
			adminRoles: ["admin", "superadmin"],
		}),
		bearer(),
		openAPI(),
		haveIBeenPwned({
			customPasswordCompromisedMessage: "Please choose a more secure password.",
		}),
	],
	databaseHooks: {
		user: {
			create: {
				before: async (user, ctx) => {
					if (!ctx?.body?.role) {
						return {
							data: { ...user },
						};
					}
					return { data: { ...user, role: ctx?.body?.role } };
				},
			},
		},
	},
});

export type AuthEnv = {
	user: typeof auth.$Infer.Session.user | null;
	session: typeof auth.$Infer.Session.session | null;
};
