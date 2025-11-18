import z from "zod";

export const nftResponseSchema = z.object({
	links: z.object({
		next: z.string().nullable(),
	}),
	nfts: z.array(
		z.object({
			account_id: z.string(),
			created_timestamp: z.string(),
			delegating_spender: z.string().nullable(),
			deleted: z.boolean(),
			metadata: z.string(),
			modified_timestamp: z.string(),
			serial_number: z.number(),
			spender: z.string().nullable(),
			token_id: z.string(),
		}),
	),
});

export type NftResponse = z.infer<typeof nftResponseSchema>;
