import { Elysia } from "elysia";
import { findAllUsers, findUserByUsername } from "../services/users";

export const profileRouter = new Elysia({ prefix: "/profile" })
	.get("/", async () => {
		const users = await findAllUsers();

		return {
			users,
		};
	})
	.get("/:username", async ({ params, status }) => {
		const { username } = params;

		const user = await findUserByUsername(username);

		if (!user) {
			return status(404, {
				error: "User not found",
			});
		}

		return {
			user,
		};
	});
