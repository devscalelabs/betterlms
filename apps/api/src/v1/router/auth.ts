import { prisma } from "@betterlms/database";
import bcrypt from "bcrypt";
import { Elysia, t } from "elysia";
import * as jose from "jose";

export const authRouter = new Elysia({ prefix: "/auth" })
	.decorate("db", prisma)
	.post(
		"/register",
		async ({ body, db, status }) => {
			const { name, username, email, password } = body;

			const getUser = await db.user.findUnique({
				where: {
					email,
				},
			});

			if (getUser) {
				return status(409, {
					error: "User already exists",
				});
			}

			const hashedPassword = await bcrypt.hash(password, 10);
			const user = await db.user.create({
				data: {
					name,
					username,
					email,
					password: hashedPassword,
				},
			});

			return status(201, {
				user,
			});
		},
		{
			body: t.Object({
				name: t.String({ minLength: 3 }),
				username: t.String({
					minLength: 4,
					format: "regex",
					pattern: "^[a-zA-Z0-9]+$",
				}),
				email: t.String({ format: "email" }),
				password: t.String({ minLength: 8 }),
			}),
		},
	)
	.post(
		"/login",
		async ({ body, db, status }) => {
			const { email, password } = body;

			const user = await db.user.findUnique({
				where: {
					email,
				},
			});

			if (!user) {
				return status(401, {
					error: "Invalid credentials",
				});
			}

			// This is safe, because this API is only for credential login
			const isPasswordValid = await bcrypt.compare(password, user.password!);

			if (!isPasswordValid) {
				return status(401, {
					error: "Invalid credentials",
				});
			}

			const secret = new TextEncoder().encode(process.env.JWT_SECRET);
			const token = await new jose.SignJWT({ id: user.id })
				.setProtectedHeader({ alg: "HS256" })
				.setExpirationTime("1h")
				.sign(secret);

			return { token };
		},
		{
			body: t.Object({
				email: t.String({ format: "email" }),
				password: t.String({ minLength: 8 }),
			}),
		},
	);
