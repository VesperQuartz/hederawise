import type { Db } from "@/lib/db";
import { NestRepo } from "./nest";
import { PlanStorage } from "./plans";
import { StashStorage } from "./stash";
import { TokenStorage } from "./token";
import { TransactionRepo } from "./transaction";
import { WalletStorage } from "./wallet";

export class RepoFactory {
	createNestFactory(db: Db) {
		return new NestRepo(db);
	}

	createPlanFactory(db: Db) {
		return new PlanStorage(db);
	}

	createStashFactory(db: Db) {
		return new StashStorage(db);
	}

	createTokenFactory(db: Db) {
		return new TokenStorage(db);
	}

	createTransactionFactory(db: Db) {
		return new TransactionRepo(db);
	}

	createWalletFactory(db: Db) {
		return new WalletStorage(db);
	}
}
