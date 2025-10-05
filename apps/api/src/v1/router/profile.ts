import { prisma } from "@betterlms/database";
import { Elysia } from "elysia";

export const profileRouter = new Elysia({ prefix: "/profile" })
	.decorate("db", prisma)
	.get("/", async ({ db }) => {
		const users = await db.user.findMany({
			select: {
				id: true,
				name: true,
				username: true,
				email: true,
				bio: true,
				imageUrl: true,
				role: true,
			},
		});

		return {
			users,
		};
	})
	.get("/:username", async ({ db, params, status }) => {
		const { username } = params;

		const user = await db.user.findUnique({
			where: {
				username,
			},
			select: {
				id: true,
				name: true,
				username: true,
				email: true,
				bio: true,
				imageUrl: true,
				role: true,
			},
		});

		if (!user) {
			return status(404, {
				error: "User not found",
			});
		}

		return {
			user,
		};
	});
