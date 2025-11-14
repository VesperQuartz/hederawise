import { env } from "@hederawise/shared/src/env";
import CryptoJs from "crypto-js";
import { relations } from "drizzle-orm";
import {
	customType,
	decimal,
	index,
	integer,
	pgTable,
	serial,
	text,
	timestamp,
	uniqueIndex,
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

export const wallet = pgTable(
	"wallet",
	{
		id: serial("id").primaryKey(),
		accountId: text("account_id").notNull(),
		privateKey: encryptedData("private_key").$type<number[]>().notNull(),
		publicKey: encryptedData("public_key").$type<number[]>().notNull(),
		userId: text("user_id").references(() => user.id),
		createdAt: timestamp("created_at", { mode: "string" }).defaultNow(),
		updatedAt: timestamp("updated_at", { mode: "string" }).defaultNow(),
	},
	(table) => [index("index_on_userid#3").on(table.userId)],
);

export const plans = pgTable(
	"plans",
	{
		id: serial("id").primaryKey(),
		name: text("name").notNull(),
		amount: decimal("amount", { mode: "number" }).notNull(),
		interval: text("interval")
			.$type<"day" | "week" | "month" | "once">()
			.notNull(),
		nextDueDate: timestamp("next_due_date", {
			mode: "string",
			withTimezone: true,
		}).notNull(),
		dueDate: timestamp("due_date", {
			mode: "string",
			withTimezone: true,
		}).notNull(),
		userId: text("user_id").references(() => user.id),
		saved: decimal("saved", { mode: "number" }).default(0),
		status: text("status")
			.$type<"active" | "paused" | "completed" | "cancelled">()
			.default("active"),
		createdAt: timestamp("created_at", {
			mode: "string",
			withTimezone: true,
		}).defaultNow(),
		updatedAt: timestamp("updated_at", {
			mode: "string",
			withTimezone: true,
		}).defaultNow(),
	},
	(table) => [
		index("index_next_due_data").on(table.nextDueDate),
		index("index_on_userid#1").on(table.userId),
		uniqueIndex("index_on_name_and_userid").on(table.name, table.userId),
	],
);

export const transactions = pgTable(
	"transactions",
	{
		id: serial("id").primaryKey(),
		amount: decimal("amount", { mode: "number" }).notNull(),
		userId: text("user_id").references(() => user.id),
		planId: integer("plan_id").references(() => plans.id),
		nftSerial: integer("serial"),
		status: text("status")
			.$type<"pending" | "completed" | "cancelled">()
			.default("pending"),
		createdAt: timestamp("created_at", { mode: "string" }).defaultNow(),
		updatedAt: timestamp("updated_at", { mode: "string" }).defaultNow(),
	},
	(table) => [index("index_on_userid#2").on(table.userId)],
);

export const userRelation = relations(user, ({ one }) => ({
	wallet: one(wallet),
}));

export const plansRelation = relations(plans, ({ many }) => ({
	transactions: many(transactions),
}));

export const transactionsRelation = relations(transactions, ({ one }) => ({
	plan: one(plans, {
		fields: [transactions.planId],
		references: [plans.id],
	}),
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

export const PlanSchema = createInsertSchema(plans, {
	amount: z.coerce.number<string>(),
	nextDueDate: z.coerce.string().optional(),
	interval: z.enum(["day", "week", "month", "once"]),
	status: z.enum(["active", "paused", "completed", "cancelled"]),
	dueDate: z.coerce.string<Date>(),
});

export const PlanSelectSchema = createSelectSchema(plans, {
	nextDueDate: z.coerce.string(),
	dueDate: z.coerce.string<Date>(),
});

export type Plan = typeof plans.$inferInsert;
export type PlanSelect = typeof plans.$inferSelect;
export type PlanSelectWithT =
	| (PlanSelect & { transactions: Transaction[] | undefined })[]
	| undefined;

export type Transaction = typeof transactions.$inferInsert;
export type TransactionSelect = typeof transactions.$inferSelect;
export const TransactionSchema = createInsertSchema(transactions, {
	status: z.enum(["pending", "completed", "cancelled"]),
});
export const TransactionSelectSchema = createSelectSchema(transactions);
