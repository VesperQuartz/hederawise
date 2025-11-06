import { Client } from "@hashgraph/sdk";
import { env } from "@hederawise/shared/env/env";

export const client = Client.forTestnet().setOperator(
	env.OPERATOR_ID!,
	env.OPERATOR_KEY!,
);
