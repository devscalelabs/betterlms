import { Elysia, t } from "elysia";
import { uploadImageToS3 } from "../../utils/upload-files";
import {
	createUserFollow,
	deleteUserFollow,
	findUserFollow,
} from "../services/follows";
import { verifyToken } from "../services/jwt";
import {
	findAllUsers,
	findUserByUsername,
	suspendUser,
	unsuspendUser,
	updateUser,
} from "../services/users";

export const profileRouter = new Elysia({ prefix: "/profile" })
	.get("/", async () => {
		const users = await findAllUsers();

		return {
			users,
		};
	})
	.get("/:username", async ({ params, headers, status }) => {
		const { username } = params;

		const user = await findUserByUsername(username);

		if (!user) {
			return status(404, {
				error: "User not found",
			});
		}

		let isFollowing = false;

		const token = headers.authorization?.split(" ")[1];
		if (token) {
			try {
				const userId = await verifyToken(token);
				const follow = await findUserFollow(userId, user.id);
				isFollowing = !!follow;
			} catch {
				// Token is invalid or expired, treat as not authenticated
				isFollowing = false;
			}
		}

		return {
			user: {
				...user,
				isFollowing,
			},
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
	)
	.post("/:username/follow", async ({ params, headers, status }) => {
		const token = headers.authorization?.split(" ")[1];

		if (!token) {
			return status(401, {
				error: "Unauthorized",
			});
		}

		const userId = await verifyToken(token);
		const { username } = params;

		const userToFollow = await findUserByUsername(username);

		if (!userToFollow) {
			return status(404, {
				error: "User not found",
			});
		}

		if (userToFollow.id === userId) {
			return status(400, {
				error: "Cannot follow yourself",
			});
		}

		const existingFollow = await findUserFollow(userId, userToFollow.id);

		if (existingFollow) {
			return status(409, {
				error: "Already following this user",
			});
		}

		await createUserFollow(userId, userToFollow.id);

		return status(201, { message: "User followed successfully" });
	})
	.delete("/:username/follow", async ({ params, headers, status }) => {
		const token = headers.authorization?.split(" ")[1];

		if (!token) {
			return status(401, {
				error: "Unauthorized",
			});
		}

		const userId = await verifyToken(token);
		const { username } = params;

		const userToUnfollow = await findUserByUsername(username);

		if (!userToUnfollow) {
			return status(404, {
				error: "User not found",
			});
		}

		const existingFollow = await findUserFollow(userId, userToUnfollow.id);

		if (!existingFollow) {
			return status(404, {
				error: "Not following this user",
			});
		}

		await deleteUserFollow(userId, userToUnfollow.id);

		return { message: "User unfollowed successfully" };
	})
	.post("/:username/suspend", async ({ params, headers, status }) => {
		const token = headers.authorization?.split(" ")[1];

		if (!token) {
			return status(401, {
				error: "Unauthorized",
			});
		}

		await verifyToken(token);
		const { username } = params;

		const userToSuspend = await findUserByUsername(username);

		if (!userToSuspend) {
			return status(404, {
				error: "User not found",
			});
		}

		const suspendedUser = await suspendUser(userToSuspend.id);

		return status(200, {
			message: "User suspended successfully",
			user: suspendedUser,
		});
	})
	.delete("/:username/suspend", async ({ params, headers, status }) => {
		const token = headers.authorization?.split(" ")[1];

		if (!token) {
			return status(401, {
				error: "Unauthorized",
			});
		}

		await verifyToken(token);
		const { username } = params;

		const userToUnsuspend = await findUserByUsername(username);

		if (!userToUnsuspend) {
			return status(404, {
				error: "User not found",
			});
		}

		const unsuspendedUser = await unsuspendUser(userToUnsuspend.id);

		return status(200, {
			message: "User unsuspended successfully",
			user: unsuspendedUser,
		});
	});
