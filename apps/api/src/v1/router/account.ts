import { prisma } from "@betterlms/database";
import { Elysia } from "elysia";
import * as jose from "jose";

export const accountRouter = new Elysia({ prefix: "/account" })
	.decorate("db", prisma)
	.get("/", async ({ db, headers, status }) => {
		const token = headers.authorization?.split(" ")[1];

		if (!token) {
			return status(401, {
				error: "Unauthorized",
			});
		}

		const decoded = await jose.jwtVerify(
			token,
			new TextEncoder().encode(process.env.JWT_SECRET),
		);

		const user = await db.user.findUnique({
			where: { id: decoded.payload.id as string },
		});

		return {
			user: {
				id: user?.id,
				name: user?.name,
				username: user?.username,
				email: user?.email,
				bio: user?.bio,
				imageUrl: user?.imageUrl,
				role: user?.role,
			},
		};
	});
