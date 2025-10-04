import { prisma } from "@betterlms/database";
import { Elysia, t } from "elysia";
import * as jose from "jose";

export const postsRouter = new Elysia({ prefix: "/posts" })
	.decorate("db", prisma)
	.get("/", async ({ db }) => {
		// Get all public posts (not deleted)
		const posts = await db.post.findMany({
			where: {
				isDeleted: false,
			},
			include: {
				user: {
					select: {
						id: true,
						name: true,
						username: true,
						imageUrl: true,
					},
				},
				channel: {
					select: {
						id: true,
						name: true,
					},
				},
			},
			orderBy: {
				createdAt: "desc",
			},
		});

		return { posts };
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

			const { title, content, channelId } = body;

			// Create post
			const post = await db.post.create({
				data: {
					title: title || null,
					content,
					channelId: channelId || null,
					userId: decoded.payload.id as string,
				},
				include: {
					user: {
						select: {
							id: true,
							name: true,
							username: true,
							imageUrl: true,
						},
					},
					channel: {
						select: {
							id: true,
							name: true,
						},
					},
				},
			});

			return status(201, { post });
		},
		{
			body: t.Object({
				title: t.Optional(t.String({ maxLength: 200 })),
				content: t.String({ minLength: 1, maxLength: 5000 }),
				channelId: t.Optional(t.String()),
			}),
		},
	)
	.delete("/:id", async ({ params, db, headers, status }) => {
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

		// Check if post exists
		const post = await db.post.findUnique({
			where: { id: params.id },
		});

		if (!post) {
			return status(404, {
				error: "Post not found",
			});
		}

		// Check if user owns the post
		if (post.userId !== decoded.payload.id) {
			return status(403, {
				error: "Forbidden - You can only delete your own posts",
			});
		}

		// Delete the post
		await db.post.delete({
			where: { id: params.id },
		});

		return { message: "Post deleted successfully" };
	});
