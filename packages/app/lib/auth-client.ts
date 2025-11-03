import { expoClient } from "@better-auth/expo/client";
import { env } from "@hederawise/shared/env/env";
import { createAuthClient } from "better-auth/react";
import * as SecureStore from "expo-secure-store";

export const authClient = createAuthClient({
	baseURL: env.EXPO_PUBLIC_BASE_URL,
	plugins: [
		expoClient({
			scheme: "hederawise",
			storagePrefix: "hederawise",
			storage: SecureStore,
		}),
	],
});
