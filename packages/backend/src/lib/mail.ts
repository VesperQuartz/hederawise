import { env } from "@hederawise/shared/env/env";
import { createTransport } from "nodemailer";

export const transporter = createTransport({
	service: "gmail",
	auth: {
		user: env.GMAIL_USER,
		pass: env.GMAIL_PASS,
	},
});
