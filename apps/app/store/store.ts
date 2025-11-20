import { client } from "@hederawise/shared/src/client";
import type { InferRequestType } from "hono/client";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { mmkvStorage } from "~/lib/mmkv";
import { User } from "~/types";

type AuthState = {
	user: User | undefined | null;
	isLoggedIn: boolean;
	setUser: (user: User) => void;
	deleteUser: () => void;
	setIsLoggedIn: (isLoggedIn: boolean) => void;
};

type Plan = InferRequestType<typeof client.api.plans.$post>["json"] | undefined;

type PlanWithId = Plan & { planId: number | undefined };

type PlanState = {
	data: PlanWithId | undefined;
	updatePlan: (plan: Partial<PlanWithId> | undefined) => void;
	clearPlan: () => void;
};

type AmountState = {
	amount: number;
	setAmount: (amount: number) => void;
	clearAmount: () => void;
};

type HomeTabsState = {
	tabs: "home" | "save" | (string & {});
	setTab: (tabs: "home" | "save" | (string & {})) => void;
};

export const useAuthStore = create<AuthState>()(
	persist(
		(set) => ({
			user: undefined,
			isLoggedIn: false,
			setUser: (user) => set(() => ({ user })),
			deleteUser: () => set(() => ({ user: undefined })),
			setIsLoggedIn: (isLoggedIn) => set(() => ({ isLoggedIn })),
		}),
		{
			name: "auth-storage",
			storage: createJSONStorage(() => mmkvStorage),
		},
	),
);

export const useHomeTabsStore = create<HomeTabsState>()(
	persist(
		(set) => ({
			tabs: "home",
			setTab: (tabs) => set(() => ({ tabs })),
		}),
		{
			name: "tabs-storage",
			storage: createJSONStorage(() => mmkvStorage),
		},
	),
);

export const usePlanStore = create<PlanState>()(
	persist(
		immer((set) => ({
			data: undefined,
			updatePlan: (plan) => set(() => ({ data: plan })),
			clearPlan: () => set(() => ({ data: undefined })),
		})),
		{
			name: "plan-storage",
			storage: createJSONStorage(() => mmkvStorage),
		},
	),
);

export const useAmountStore = create<AmountState>()(
	immer((set) => ({
		amount: 0,
		setAmount: (amount) => set(() => ({ amount: amount })),
		clearAmount: () => set(() => ({ amount: undefined })),
	})),
);
