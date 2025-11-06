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

export interface BearState {
	bears: number;
	increasePopulation: () => void;
	removeAllBears: () => void;
	updateBears: (newBears: number) => void;
}

export const useStore = create<BearState>((set) => ({
	bears: 0,
	increasePopulation: () => set((state) => ({ bears: state.bears + 1 })),
	removeAllBears: () => set({ bears: 0 }),
	updateBears: (newBears) => set({ bears: newBears }),
}));
