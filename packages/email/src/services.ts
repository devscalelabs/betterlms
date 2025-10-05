import nodemailer, { type Transporter } from "nodemailer";
import type SMTPTransport from "nodemailer/lib/smtp-transport";
import { emailConfig } from "./config";
import type { SendEmailOptions } from "./types";

let transporter: Transporter<SMTPTransport.SentMessageInfo> | null = null;

export const getTransporter =
	(): Transporter<SMTPTransport.SentMessageInfo> => {
		if (!transporter) {
			transporter = nodemailer.createTransport({
				host: emailConfig.host,
				port: emailConfig.port,
				secure: emailConfig.secure,
				auth: {
					user: emailConfig.auth.user,
					pass: emailConfig.auth.pass,
				},
			});
		}
		return transporter;
	};

/**
 * Send an email using the configured SMTP server
 */
export const sendEmail = async (
	options: SendEmailOptions,
): Promise<SMTPTransport.SentMessageInfo> => {
	const transport = getTransporter();

	const mailOptions = {
		from: options.from || emailConfig.from,
		to: options.to,
		subject: options.subject,
		text: options.text,
		html: options.html,
		cc: options.cc,
		bcc: options.bcc,
		replyTo: options.replyTo,
		attachments: options.attachments,
	};

	try {
		const info = await transport.sendMail(mailOptions);
		console.log(`Email sent successfully: ${info.messageId}`);
		return info;
	} catch (error) {
		console.error("Failed to send email:", error);
		throw error;
	}
};

/**
 * Verify SMTP connection configuration
 */
export const verifyConnection = async (): Promise<boolean> => {
	const transport = getTransporter();
	try {
		await transport.verify();
		console.log("SMTP connection verified successfully");
		return true;
	} catch (error) {
		console.error("SMTP connection verification failed:", error);
		throw error;
	}
};

/**
 * Close the transporter connection
 */
export const closeConnection = (): void => {
	if (transporter) {
		transporter.close();
		transporter = null;
	}
};
