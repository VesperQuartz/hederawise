import { env } from "@hederawise/shared/src/env";
import CryptoJs from "crypto-js";
import { relations } from "drizzle-orm";
import {
	customType,
	pgTable,
	serial,
	text,
	timestamp,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import z from "zod";
import { user } from "./auth.schema";

const encryptedData = <TData>(name: string) =>
	customType<{ data: TData; driverData: string }>({
		dataType() {
			return "jsonb";
		},
		// Take the value from the database and return it as a string
		fromDriver(value) {
			const data = CryptoJs.AES.decrypt(value, env.DB_KEY!);
			console.log(data);
			return JSON.parse(data.toString(CryptoJs.enc.Utf8)) as TData;
		},
		// Insert the value into the database as a string
		toDriver(value: TData) {
			const data = CryptoJs.AES.encrypt(JSON.stringify(value), env.DB_KEY!);
			return JSON.stringify(data.toString());
		},
	})(name);

export const token = pgTable("token", {
	id: serial("id").primaryKey(),
	tokenId: text("token_id").notNull(),
	tokenName: text("token_name").notNull(),
	tokenSymbol: text("token_symbol").notNull(),
	privateKey: encryptedData("private_key").$type<number[]>().notNull(),
	createdAt: timestamp("created_at", { mode: "string" }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: "string" }).defaultNow(),
});

export const wallet = pgTable("wallet", {
	id: serial("id").primaryKey(),
	accountId: text("account_id").notNull(),
	privateKey: encryptedData("private_key").$type<number[]>().notNull(),
	publicKey: encryptedData("public_key").$type<number[]>().notNull(),
	userId: text("user_id").references(() => user.id),
	createdAt: timestamp("created_at", { mode: "string" }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: "string" }).defaultNow(),
});

export const userRelation = relations(user, ({ one }) => ({
	wallet: one(wallet),
}));

export type Token = typeof token.$inferInsert;
export type TokenSelect = typeof token.$inferSelect;
export const TokenSchema = createInsertSchema(token);
export const TokenSelectSchema = createSelectSchema(token);

export type Wallet = typeof wallet.$inferInsert;
export const WalletSchema = createInsertSchema(wallet, {
	privateKey: z.array(z.number()),
	publicKey: z.array(z.number()),
});

export type WalletSelect = typeof wallet.$inferSelect;
export const WalletSelectSchema = createSelectSchema(wallet);
