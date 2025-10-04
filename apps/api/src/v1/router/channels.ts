import { prisma } from "@betterlms/database";
import { Elysia, t } from "elysia";
import * as jose from "jose";

export const channelsRouter = new Elysia({ prefix: "/channels" })
	.decorate("db", prisma)
	.get("/", async ({ db }) => {
		// Get channels where user is a member or public channels
		const channels = await db.channel.findMany({
			where: {
				isPrivate: false,
			},
			include: {
				members: {
					include: {
						user: {
							select: {
								id: true,
								name: true,
								username: true,
								imageUrl: true,
							},
						},
					},
				},
				_count: {
					select: {
						posts: true,
					},
				},
			},
		});

		return { channels };
	})
	.post(
		"/",
		async ({ body, db, headers, status }) => {
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

			const { name, isPrivate } = body;

			// Create channel
			const channel = await db.channel.create({
				data: {
					name,
					isPrivate: isPrivate || false,
				},
			});

			// Add creator as member
			await db.channelMember.create({
				data: {
					userId: decoded.payload.id as string,
					channelId: channel.id,
				},
			});

			return status(201, { channel });
		},
		{
			body: t.Object({
				name: t.String({ minLength: 1, maxLength: 100 }),
				isPrivate: t.Optional(t.Boolean()),
			}),
		},
	)
	.get("/:id", async ({ params, db, headers, status }) => {
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

		const channel = await db.channel.findUnique({
			where: { id: params.id },
			include: {
				members: {
					include: {
						user: {
							select: {
								id: true,
								name: true,
								username: true,
								imageUrl: true,
							},
						},
					},
				},
				posts: {
					include: {
						user: {
							select: {
								id: true,
								name: true,
								username: true,
								imageUrl: true,
							},
						},
					},
					orderBy: {
						createdAt: "desc",
					},
				},
			},
		});

		if (!channel) {
			return status(404, {
				error: "Channel not found",
			});
		}

		// Check if user has access to this channel
		const isMember = channel.members.some(
			(member: { userId: string }) => member.userId === decoded.payload.id,
		);

		if (channel.isPrivate && !isMember) {
			return status(403, {
				error: "Access denied",
			});
		}

		return { channel };
	})
	.post("/:id/join", async ({ params, db, headers, status }) => {
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

		const channel = await db.channel.findUnique({
			where: { id: params.id },
		});

		if (!channel) {
			return status(404, {
				error: "Channel not found",
			});
		}

		// Check if user is already a member
		const existingMember = await db.channelMember.findUnique({
			where: {
				userId_channelId: {
					userId: decoded.payload.id as string,
					channelId: params.id,
				},
			},
		});

		if (existingMember) {
			return status(409, {
				error: "Already a member of this channel",
			});
		}

		// Add user as member
		const member = await db.channelMember.create({
			data: {
				userId: decoded.payload.id as string,
				channelId: params.id,
			},
		});

		return status(201, { member });
	})
	.delete("/:id/leave", async ({ params, db, headers, status }) => {
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

		// Remove user from channel
		await db.channelMember.delete({
			where: {
				userId_channelId: {
					userId: decoded.payload.id as string,
					channelId: params.id,
				},
			},
		});

		return { message: "Left channel successfully" };
	});
