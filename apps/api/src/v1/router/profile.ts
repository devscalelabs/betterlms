import { Elysia, t } from "elysia";
import { uploadImageToS3 } from "../../utils/upload-files";
import { verifyToken } from "../services/jwt";
import {
	findAllUsers,
	findUserByUsername,
	updateUser,
} from "../services/users";

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
	})
	.put(
		"/",
		async ({ body, headers, status }) => {
			const token = headers.authorization?.split(" ")[1];

			if (!token) {
				return status(401, {
					error: "Unauthorized",
				});
			}

			const userId = await verifyToken(token);
			const { name, bio, avatar } = body;

			const updateData: {
				name?: string;
				bio?: string;
				imageUrl?: string;
			} = {};

			if (name) updateData.name = name;
			if (bio !== undefined) updateData.bio = bio;

			if (avatar) {
				const imageUrl = await uploadImageToS3(avatar, userId, "avatars");
				updateData.imageUrl = imageUrl;
			}

			const user = await updateUser(userId, updateData);

			return {
				user,
			};
		},
		{
			body: t.Object({
				name: t.Optional(t.String({ minLength: 1, maxLength: 100 })),
				bio: t.Optional(t.String({ maxLength: 500 })),
				avatar: t.Optional(t.File()),
			}),
		},
	);
