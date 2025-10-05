import { Elysia } from "elysia";
import { verifyToken } from "../services/jwt";
import { findUserById } from "../services/users";

export const accountRouter = new Elysia({ prefix: "/account" }).get(
	"/",
	async ({ headers, status }) => {
		const token = headers.authorization?.split(" ")[1];

		if (!token) {
			return status(401, {
				error: "Unauthorized",
			});
		}

		try {
			const userId = await verifyToken(token);
			const user = await findUserById(userId);

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
		} catch (error) {
			return status(401, {
				error: `${error}`,
			});
		}
	},
);
