import { Elysia, t } from "elysia";
import { sendMagicLinkEmail } from "../services/emails";
import { generateToken } from "../services/jwt";
import {
	createMagicLink,
	findUnusedMagicLink,
	generateCode,
	markMagicLinkAsUsed,
} from "../services/magic-link";
import {
	findUserByEmail,
	findUserByEmailWithPassword,
	validatePassword,
} from "../services/users";

export const authRouter = new Elysia({ prefix: "/auth" })
	.post(
		"/login",
		async ({ body, status }) => {
			const { email, password } = body;

			// If password is provided, use password authentication
			if (password) {
				const user = await findUserByEmailWithPassword(email);

				if (!user) {
					return status(401, {
						error: "Invalid email or password",
					});
				}

				if (!user.password) {
					return status(401, {
						error:
							"Password authentication not available for this account. Please use magic link login.",
					});
				}

				const isValidPassword = await validatePassword(password, user.password);
				if (!isValidPassword) {
					return status(401, {
						error: "Invalid email or password",
					});
				}

				if (user.isSuspended) {
					return status(403, {
						error:
							"Your account has been suspended. Please contact support for assistance.",
					});
				}

				const token = await generateToken(user.id);

				return status(200, {
					token,
					user: {
						id: user.id,
						email: user.email,
						name: user.name,
						username: user.username,
						role: user.role,
					},
				});
			}

			// If no password provided, use magic link authentication
			const user = await findUserByEmail(email);

			if (!user) {
				return status(404, {
					error: "User not found. Please contact admin to create an account.",
				});
			}

			const code = generateCode();
			const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

			await createMagicLink(email, code, expiresAt);

			const magicLinkUrl = `${process.env.FRONTEND_URL}/auth/verify?code=${code}&email=${encodeURIComponent(email)}`;

			try {
				await sendMagicLinkEmail(email, code, magicLinkUrl);

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
				password: t.Optional(t.String({ minLength: 1 })),
			}),
		},
	)
	.post(
		"/verify",
		async ({ body, status }) => {
			const { email, code } = body;

			const magicLink = await findUnusedMagicLink(email, code);

			if (!magicLink) {
				return status(401, {
					error: "Invalid or expired code",
				});
			}

			if (magicLink.expiresAt < new Date()) {
				return status(401, {
					error: "Code has expired. Please request a new one.",
				});
			}

			await markMagicLinkAsUsed(magicLink.id);

			const user = await findUserByEmail(email);

			if (!user) {
				return status(404, {
					error: "User not found",
				});
			}

			if (user.isSuspended) {
				return status(403, {
					error:
						"Your account has been suspended. Please contact support for assistance.",
				});
			}

			const token = await generateToken(user.id);

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
