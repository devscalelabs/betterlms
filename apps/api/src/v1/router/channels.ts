import { Elysia, t } from "elysia";
import {
	addChannelMember,
	createChannel,
	findChannelById,
	findChannelMember,
	findPublicChannels,
	removeChannelMember,
} from "../services/channels";
import { verifyToken } from "../services/jwt";

export const channelsRouter = new Elysia({ prefix: "/channels" })
	.get("/", async () => {
		const channels = await findPublicChannels();
		return { channels };
	})
	.post(
		"/",
		async ({ body, headers, status }) => {
			const token = headers.authorization?.split(" ")[1];

			if (!token) {
				return status(401, {
					error: "Unauthorized",
				});
			}

			const userId = await verifyToken(token);
			const { name, isPrivate } = body;

			const channel = await createChannel(name, isPrivate || false);
			await addChannelMember(userId, channel.id);

			return status(201, { channel });
		},
		{
			body: t.Object({
				name: t.String({ minLength: 1, maxLength: 100 }),
				isPrivate: t.Optional(t.Boolean()),
			}),
		},
	)
	.get("/:id", async ({ params, headers, status }) => {
		const token = headers.authorization?.split(" ")[1];

		if (!token) {
			return status(401, {
				error: "Unauthorized",
			});
		}

		const userId = await verifyToken(token);
		const channel = await findChannelById(params.id);

		if (!channel) {
			return status(404, {
				error: "Channel not found",
			});
		}

		const isMember = channel.members.some(
			(member: { userId: string }) => member.userId === userId,
		);

		if (channel.isPrivate && !isMember) {
			return status(403, {
				error: "Access denied",
			});
		}

		return { channel };
	})
	.post("/:id/join", async ({ params, headers, status }) => {
		const token = headers.authorization?.split(" ")[1];

		if (!token) {
			return status(401, {
				error: "Unauthorized",
			});
		}

		const userId = await verifyToken(token);
		const channel = await findChannelById(params.id);

		if (!channel) {
			return status(404, {
				error: "Channel not found",
			});
		}

		const existingMember = await findChannelMember(userId, params.id);

		if (existingMember) {
			return status(409, {
				error: "Already a member of this channel",
			});
		}

		const member = await addChannelMember(userId, params.id);

		return status(201, { member });
	})
	.delete("/:id/leave", async ({ params, headers, status }) => {
		const token = headers.authorization?.split(" ")[1];

		if (!token) {
			return status(401, {
				error: "Unauthorized",
			});
		}

		const userId = await verifyToken(token);
		await removeChannelMember(userId, params.id);

		return { message: "Left channel successfully" };
	});
