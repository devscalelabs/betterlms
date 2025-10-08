import {
	createMagicLink,
	findUnusedMagicLink,
	findUserByEmail,
	findUserByEmailWithPassword,
	generateCode,
	generateToken,
	markMagicLinkAsUsed,
	sendMagicLinkEmail,
	validatePassword,
} from "@betterlms/core";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";

const authRouter = new Hono();

authRouter.post(
	"/auth/login",
	zValidator(
		"json",
		z.object({
			email: z.string().email(),
			password: z.string().optional(),
		}),
	),
	async (c) => {
		const body = c.req.valid("json");
		const { email, password } = body;

		// If password is provided, use password authentication
		if (password) {
			const user = await findUserByEmailWithPassword(email);

			if (!user) {
				return c.json(
					{
						error: "Invalid email or password",
					},
					401,
				);
			}

			if (!user.password) {
				return c.json(
					{
						error:
							"Password authentication not available for this account. Please use magic link login.",
					},
					401,
				);
			}

			const isValidPassword = await validatePassword(password, user.password);
			if (!isValidPassword) {
				return c.json(
					{
						error: "Invalid email or password",
					},
					401,
				);
			}

			if (user.isSuspended) {
				return c.json(
					{
						error:
							"Your account has been suspended. Please contact support for assistance.",
					},
					403,
				);
			}

			const token = await generateToken(user.id);

			return c.json(
				{
					token,
					user: {
						id: user.id,
						email: user.email,
						name: user.name,
						username: user.username,
						role: user.role,
					},
				},
				200,
			);
		}

		// If no password provided, use magic link authentication
		const user = await findUserByEmail(email);

		if (!user) {
			return c.json(
				{
					error: "User not found. Please contact admin to create an account.",
				},
				400,
			);
		}

		const code = generateCode();
		const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

		await createMagicLink(email, code, expiresAt);

		const magicLinkUrl = `${process.env.FRONTEND_URL}/auth/verify?code=${code}&email=${encodeURIComponent(email)}`;

		try {
			await sendMagicLinkEmail(email, code, magicLinkUrl);

			return c.json(
				{
					message: "Magic link sent to your email",
				},
				200,
			);
		} catch (error) {
			console.error("Failed to send magic link email:", error);
			return c.json(
				{
					error: "Failed to send email. Please try again later.",
				},
				500,
			);
		}
	},
);

authRouter.post(
	"/auth/verify",
	zValidator(
		"json",
		z.object({
			email: z.string().email(),
			code: z.string().min(6).max(6),
		}),
	),
	async (c) => {
		const body = c.req.valid("json");
		const { email, code } = body;

		const magicLink = await findUnusedMagicLink(email, code);

		if (!magicLink) {
			return c.json(
				{
					error: "Invalid or expired code",
				},
				401,
			);
		}

		if (magicLink.expiresAt < new Date()) {
			return c.json(
				{
					error: "Code has expired. Please request a new one.",
				},
				401,
			);
		}

		await markMagicLinkAsUsed(magicLink.id);

		const user = await findUserByEmail(email);

		if (!user) {
			return c.json(
				{
					error: "User not found",
				},
				400,
			);
		}

		if (user.isSuspended) {
			return c.json(
				{
					error:
						"Your account has been suspended. Please contact support for assistance.",
				},
				403,
			);
		}

		const token = await generateToken(user.id);

		return c.json(
			{
				token,
				user: {
					id: user.id,
					email: user.email,
					name: user.name,
					username: user.username,
				},
			},
			200,
		);
	},
);

export { authRouter };
