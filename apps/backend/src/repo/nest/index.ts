import { eq } from "drizzle-orm";
import type { Db } from "@/lib/db";
import { type Nest, type NestSelect, nest } from "../schema/schema";

export interface NestImpl {
	createNest(payload: Nest): Promise<NestSelect>;
	getNextByUserId(userId: string): Promise<NestSelect[]>;
	getNestbyNestId(nestId: number): Promise<NestSelect>;
}

export class NestRepo implements NestImpl {
	constructor(private readonly Db: Db) {}
	async createNest(payload: Nest): Promise<NestSelect> {
		const data = await this.Db.insert(nest).values(payload).returning();
		return data[0]!;
	}

	async getNextByUserId(userId: string): Promise<NestSelect[]> {
		const data = await this.Db.query.nest.findMany({
			where: eq(nest.userId, userId),
		});
		return data;
	}

	async getNestbyNestId(nestId: number): Promise<NestSelect> {
		const data = await this.Db.query.nest.findMany({
			where: eq(nest.id, nestId),
		});
		return data[0]!;
	}
}
