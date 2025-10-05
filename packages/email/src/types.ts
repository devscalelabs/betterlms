export type EmailAddress = string | { name: string; address: string };

export interface EmailAttachment {
	filename: string;
	content?: string | Buffer;
	path?: string;
	contentType?: string;
	cid?: string;
}

export interface SendEmailOptions {
	to: EmailAddress | EmailAddress[];
	subject: string;
	text?: string;
	html?: string;
	from?: EmailAddress;
	cc?: EmailAddress | EmailAddress[];
	bcc?: EmailAddress | EmailAddress[];
	replyTo?: EmailAddress;
	attachments?: EmailAttachment[];
}

export interface EmailConfig {
	host: string;
	port: number;
	secure: boolean;
	auth: {
		user: string;
		pass: string;
	};
	from: EmailAddress;
}
