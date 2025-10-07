import { sendEmail } from "@betterlms/email";

export async function sendMagicLinkEmail(
	email: string,
	code: string,
	magicLinkUrl: string,
): Promise<void> {
	await sendEmail({
		to: email,
		subject: "Your Magic Link to Login",
		text: `Your verification code is: ${code}\n\nOr click this link to login: ${magicLinkUrl}\n\nThis link will expire in 15 minutes.`,
		html: `
			<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
				<h2>Login to BetterLMS</h2>
				<p>Your verification code is:</p>
				<h1 style="background-color: #f4f4f4; padding: 20px; text-align: center; letter-spacing: 5px;">${code}</h1>
				<p>Or click the button below to login:</p>
				<a href="${magicLinkUrl}" style="display: inline-block; background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; margin: 20px 0;">Login to BetterLMS</a>
				<p style="color: #666; font-size: 14px;">This link will expire in 15 minutes.</p>
				<p style="color: #999; font-size: 12px;">If you didn't request this, please ignore this email.</p>
			</div>
		`,
	});
}
