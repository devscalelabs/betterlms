import {
	createUserFollow,
	deleteUserFollow,
	findAllUsers,
	findUserByUsername,
	findUserFollow,
	suspendUser,
	unsuspendUser,
	updateUser,
	verifyToken,
} from "@betterlms/core";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";
import { uploadImageToS3 } from "../../utils/upload-files";

const profileRouter = new Hono();

profileRouter.get("/profile/", async (c) => {
	const users = await findAllUsers();

	return c.json({
		users,
	});
});

profileRouter.get("/profile/:username/", async (c) => {
	const username = c.req.param("username");

	const user = await findUserByUsername(username);

	if (!user) {
		return c.json(
			{
				error: "User not found",
			},
			404,
		);
	}

	let isFollowing = false;

	const token = c.req.header("authorization")?.split(" ")[1];
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

	return c.json({
		user: {
			...user,
			isFollowing,
		},
	});
});

profileRouter.put(
	"/profile/",
	zValidator(
		"form",
		z.object({
			name: z.string().min(1).max(100).optional(),
			bio: z.string().max(500).optional(),
			avatar: z.instanceof(File).optional(),
		}),
	),
	async (c) => {
		const token = c.req.header("authorization")?.split(" ")[1];

		if (!token) {
			return c.json(
				{
					error: "Unauthorized",
				},
				401,
			);
		}

		const userId = await verifyToken(token);
		const body = c.req.valid("form");
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

		return c.json({
			user,
		});
	},
);

profileRouter.post("/profile/:username/follow/", async (c) => {
	const token = c.req.header("authorization")?.split(" ")[1];

	if (!token) {
		return c.json(
			{
				error: "Unauthorized",
			},
			401,
		);
	}

	const userId = await verifyToken(token);
	const username = c.req.param("username");

	const userToFollow = await findUserByUsername(username);

	if (!userToFollow) {
		return c.json(
			{
				error: "User not found",
			},
			404,
		);
	}

	if (userToFollow.id === userId) {
		return c.json(
			{
				error: "Cannot follow yourself",
			},
			400,
		);
	}

	const existingFollow = await findUserFollow(userId, userToFollow.id);

	if (existingFollow) {
		return c.json(
			{
				error: "Already following this user",
			},
			409,
		);
	}

	await createUserFollow(userId, userToFollow.id);

	return c.json({ message: "User followed successfully" }, 201);
});

profileRouter.delete("/profile/:username/follow/", async (c) => {
	const token = c.req.header("authorization")?.split(" ")[1];

	if (!token) {
		return c.json(
			{
				error: "Unauthorized",
			},
			401,
		);
	}

	const userId = await verifyToken(token);
	const username = c.req.param("username");

	const userToUnfollow = await findUserByUsername(username);

	if (!userToUnfollow) {
		return c.json(
			{
				error: "User not found",
			},
			404,
		);
	}

	const existingFollow = await findUserFollow(userId, userToUnfollow.id);

	if (!existingFollow) {
		return c.json(
			{
				error: "Not following this user",
			},
			404,
		);
	}

	await deleteUserFollow(userId, userToUnfollow.id);

	return c.json({ message: "User unfollowed successfully" });
});

profileRouter.post("/profile/:username/suspend/", async (c) => {
	const token = c.req.header("authorization")?.split(" ")[1];

	if (!token) {
		return c.json(
			{
				error: "Unauthorized",
			},
			401,
		);
	}

	await verifyToken(token);
	const username = c.req.param("username");

	const userToSuspend = await findUserByUsername(username);

	if (!userToSuspend) {
		return c.json(
			{
				error: "User not found",
			},
			404,
		);
	}

	const suspendedUser = await suspendUser(userToSuspend.id);

	return c.json(
		{
			message: "User suspended successfully",
			user: suspendedUser,
		},
		200,
	);
});

profileRouter.delete("/profile/:username/suspend/", async (c) => {
	const token = c.req.header("authorization")?.split(" ")[1];

	if (!token) {
		return c.json(
			{
				error: "Unauthorized",
			},
			401,
		);
	}

	await verifyToken(token);
	const username = c.req.param("username");

	const userToUnsuspend = await findUserByUsername(username);

	if (!userToUnsuspend) {
		return c.json(
			{
				error: "User not found",
			},
			404,
		);
	}

	const unsuspendedUser = await unsuspendUser(userToUnsuspend.id);

	return c.json(
		{
			message: "User unsuspended successfully",
			user: unsuspendedUser,
		},
		200,
	);
});

export { profileRouter };
