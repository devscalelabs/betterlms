import { prisma } from "@betterlms/database";
import { jwt } from "@elysiajs/jwt";
import bcrypt from "bcrypt";
import { Elysia, t } from "elysia";

export const authRouter = new Elysia({ prefix: "/auth" })
	.decorate("db", prisma)
	.use(
		jwt({
			name: "jwt",
			secret: "Fischl von Luftschloss Narfidort",
		}),
	)
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

			return status(200, {
				user,
			});
		},
		{
			body: t.Object({
				email: t.String({ format: "email" }),
				password: t.String({ minLength: 8 }),
			}),
		},
	);
