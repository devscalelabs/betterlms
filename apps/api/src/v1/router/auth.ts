import { prisma } from "@betterlms/database";
import { sendEmail } from "@betterlms/email";
import { Elysia, t } from "elysia";
import * as jose from "jose";

// Generate a random 6-digit code
const generateCode = (): string => {
	return Math.floor(100000 + Math.random() * 900000).toString();
};

export const authRouter = new Elysia({ prefix: "/auth" })
	.decorate("db", prisma)
	.post(
		"/login",
		async ({ body, db, status }) => {
			const { email } = body;

			// Check if user exists
			const user = await db.user.findUnique({
				where: { email },
			});

			if (!user) {
				return status(404, {
					error: "User not found. Please contact admin to create an account.",
				});
			}

			// Generate a unique code
			const code = generateCode();
			const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

			// Save magic link to database
			await db.magicLink.create({
				data: {
					email,
					code,
					expiresAt,
				},
			});

			// Create magic link URL (adjust the URL based on your frontend)
			const magicLinkUrl = `${process.env.FRONTEND_URL}/auth/verify?code=${code}&email=${encodeURIComponent(email)}`;

			// Send email with magic link
			try {
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

				return status(200, {
					message: "Magic link sent to your email",
				});
			} catch (error) {
				console.error("Failed to send magic link email:", error);
				return status(500, {
					error: "Failed to send email. Please try again later.",
				});
			}
		},
		{
			body: t.Object({
				email: t.String({ format: "email" }),
			}),
		},
	)
	.post(
		"/verify",
		async ({ body, db, status }) => {
			const { email, code } = body;

			// Find the magic link
			const magicLink = await db.magicLink.findFirst({
				where: {
					email,
					code,
					isUsed: false,
				},
			});

			if (!magicLink) {
				return status(401, {
					error: "Invalid or expired code",
				});
			}

			// Check if expired
			if (magicLink.expiresAt < new Date()) {
				return status(401, {
					error: "Code has expired. Please request a new one.",
				});
			}

			// Mark as used
			await db.magicLink.update({
				where: { id: magicLink.id },
				data: { isUsed: true },
			});

			// Get user
			const user = await db.user.findUnique({
				where: { email },
			});

			if (!user) {
				return status(404, {
					error: "User not found",
				});
			}

			// Generate JWT token
			const secret = new TextEncoder().encode(process.env.JWT_SECRET);
			const token = await new jose.SignJWT({ id: user.id })
				.setProtectedHeader({ alg: "HS256" })
				.setExpirationTime("7d")
				.sign(secret);

			return status(200, {
				token,
				user: {
					id: user.id,
					email: user.email,
					name: user.name,
					username: user.username,
				},
			});
		},
		{
			body: t.Object({
				email: t.String({ format: "email" }),
				code: t.String({ minLength: 6, maxLength: 6 }),
			}),
		},
	);
