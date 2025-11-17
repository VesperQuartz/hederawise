import type { Stash } from "@/repo/schema/schema";
import type { StashImpl } from "@/repo/stash";

export class StashService {
	constructor(private readonly stashStore: StashImpl) {}

	async getUserStash(userId: string) {
		const stash = this.stashStore.getUserStash(userId);
		return stash;
	}

	async createStash(stash: Stash) {
		return this.stashStore.createStash(stash);
	}

	async withdrawFromStash(amount: number, userId: string) {
		const stash = await this.stashStore.getUserStash(userId);
		await this.stashStore.updateStashAmount(stash.id, stash.amount - amount);
	}

	async withdrawToStash(amount: number, userId: string) {
		const stash = await this.stashStore.getUserStash(userId);
		await this.stashStore.updateStashAmount(stash.id, stash.amount + amount);
	}
}
