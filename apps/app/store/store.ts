import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { mmkvStorage } from "~/lib/mmkv";
import { User } from "~/types";

type AuthState = {
	user: User | undefined | null;
	isLoggedIn: boolean;
	setUser: (user: User) => void;
	deleteUser: () => void;
	setIsLoggedIn: (isLoggedIn: boolean) => void;
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
