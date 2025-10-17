import {
	addChannelMember,
	createChannel,
	findAllChannels,
	findChannelById,
	findChannelMember,
	findPublicChannels,
	removeChannelMember,
	updateChannel,
	verifyToken,
} from "@betterlms/core";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";

const channelsRouter = new Hono();

channelsRouter.get("/channels/", async (c) => {
	const includePrivate = c.req.query("includePrivate");
	if (includePrivate === "1" || includePrivate === "true") {
		const channels = await findAllChannels();
		return c.json({ channels });
	}
	const channels = await findPublicChannels();
	return c.json({ channels });
});

channelsRouter.post(
	"/channels/",
	zValidator(
		"json",
		z.object({
			name: z.string().min(1).max(100),
			isPrivate: z.boolean().optional(),
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
		const body = c.req.valid("json");
		const { name, isPrivate } = body;

		const channel = await createChannel(name, isPrivate || false);
		await addChannelMember(userId, channel.id);

		return c.json({ channel }, 201);
	},
);

channelsRouter.get("/channels/:id/", async (c) => {
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
	const channel = await findChannelById(c.req.param("id"));

	if (!channel) {
		return c.json(
			{
				error: "Channel not found",
			},
			404,
		);
	}

	const isMember = channel.members.some(
		(member: { userId: string }) => member.userId === userId,
	);

	if (channel.isPrivate && !isMember) {
		return c.json(
			{
				error: "Access denied",
			},
			403,
		);
	}

	return c.json({ channel });
});

channelsRouter.put(
	"/channels/:id/",
	zValidator(
		"json",
		z.object({
			name: z.string().min(1).max(100).optional(),
			isPrivate: z.boolean().optional(),
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

		await verifyToken(token);
		const body = c.req.valid("json");
		const id = c.req.param("id");

		const existing = await findChannelById(id);
		if (!existing) {
			return c.json(
				{
					error: "Channel not found",
				},
				404,
			);
		}

		const updateData: { name?: string; isPrivate?: boolean } = {};
		if (body.name !== undefined) updateData.name = body.name;
		if (body.isPrivate !== undefined) updateData.isPrivate = body.isPrivate;
		const channel = await updateChannel(id, updateData);

		return c.json({ channel });
	},
);

channelsRouter.post("/channels/:id/join/", async (c) => {
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
	const channel = await findChannelById(c.req.param("id"));

	if (!channel) {
		return c.json(
			{
				error: "Channel not found",
			},
			404,
		);
	}

	const existingMember = await findChannelMember(userId, c.req.param("id"));

	if (existingMember) {
		return c.json(
			{
				error: "Already a member of this channel",
			},
			409,
		);
	}

	const member = await addChannelMember(userId, c.req.param("id"));

	return c.json({ member }, 201);
});

channelsRouter.delete("/channels/:id/leave/", async (c) => {
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
	await removeChannelMember(userId, c.req.param("id"));

	return c.json({ message: "Left channel successfully" });
});

// Admin: add/remove specific user in a channel
channelsRouter.post(
	"/channels/:id/members/",
	zValidator(
		"json",
		z.object({
			userId: z.string().min(1),
		}),
	),
	async (c) => {
		const token = c.req.header("authorization")?.split(" ")[1];
		if (!token) {
			return c.json({ error: "Unauthorized" }, 401);
		}
		await verifyToken(token);
		const { userId } = c.req.valid("json");
		const channelId = c.req.param("id");

		const existing = await findChannelById(channelId);
		if (!existing) {
			return c.json({ error: "Channel not found" }, 404);
		}
		if (!existing.isPrivate) {
			return c.json(
				{ error: "Membership can only be managed for private channels" },
				403,
			);
		}

		const existingMember = await findChannelMember(userId, channelId);
		if (existingMember) {
			return c.json({ error: "User already a member" }, 409);
		}

		const member = await addChannelMember(userId, channelId);
		return c.json({ member }, 201);
	},
);

channelsRouter.delete("/channels/:id/members/:userId/", async (c) => {
	const token = c.req.header("authorization")?.split(" ")[1];
	if (!token) {
		return c.json({ error: "Unauthorized" }, 401);
	}
	await verifyToken(token);
	const channelId = c.req.param("id");
	const userId = c.req.param("userId");

	const existing = await findChannelById(channelId);
	if (!existing) {
		return c.json({ error: "Channel not found" }, 404);
	}
	if (!existing.isPrivate) {
		return c.json(
			{ error: "Membership can only be managed for private channels" },
			403,
		);
	}

	await removeChannelMember(userId, channelId);
	return c.json({ message: "Member removed" });
});

export { channelsRouter };
