import type { EmailConfig } from "./types";

const host = process.env.SMTP_HOST || "";
const port = Number.parseInt(process.env.SMTP_PORT || "587", 10);
const secure = (process.env.SMTP_SECURE || "false").toLowerCase() === "true";
const user = process.env.SMTP_USER || "";
const pass = process.env.SMTP_PASS || "";
const fromName = process.env.SMTP_FROM_NAME || "";
const fromAddress = process.env.SMTP_FROM_ADDRESS || "";

if (!host) {
	throw new Error("Missing SMTP_HOST environment variable");
}

if (!user) {
	throw new Error("Missing SMTP_USER environment variable");
}

if (!pass) {
	throw new Error("Missing SMTP_PASS environment variable");
}

if (!fromAddress) {
	throw new Error("Missing SMTP_FROM_ADDRESS environment variable");
}

export const emailConfig: EmailConfig = {
	host,
	port,
	secure,
	auth: {
		user,
		pass,
	},
	from: fromName
		? {
				name: fromName,
				address: fromAddress,
			}
		: fromAddress,
};

export const getEmailConfig = (): EmailConfig => emailConfig;
