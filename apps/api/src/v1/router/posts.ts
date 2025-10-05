import { prisma } from "@betterlms/database";
import { Elysia, t } from "elysia";
import * as jose from "jose";
import { uploadImageToS3 } from "../../utils/upload-files";

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
				Media: {
					select: {
						id: true,
						url: true,
						type: true,
						createdAt: true,
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

			const { title, content, channelId, images } = body;
			const userId = decoded.payload.id as string;

			// Create post
			const post = await db.post.create({
				data: {
					title: title || null,
					content,
					channelId: channelId || null,
					userId,
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
					Media: {
						select: {
							id: true,
							url: true,
							type: true,
							createdAt: true,
						},
					},
				},
			});

			// Upload images and create media records
			if (images && images.length > 0) {
				console.log(`Uploading ${images.length} image(s) to S3...`);

				const mediaRecords = await Promise.all(
					images.map(async (image) => {
						const url = await uploadImageToS3(image, userId);
						console.log(`Uploaded: ${image.name} -> ${url}`);

						return db.media.create({
							data: {
								url,
								type: "IMAGE",
								userId,
								postId: post.id,
							},
						});
					}),
				);

				console.log(`Created ${mediaRecords.length} media record(s)`);

				// Refetch post with media
				const postWithMedia = await db.post.findUnique({
					where: { id: post.id },
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
						Media: {
							select: {
								id: true,
								url: true,
								type: true,
								createdAt: true,
							},
						},
					},
				});

				return status(201, { post: postWithMedia });
			}

			return status(201, { post });
		},
		{
			body: t.Object({
				title: t.Optional(t.String({ maxLength: 200 })),
				content: t.String({ minLength: 1, maxLength: 5000 }),
				channelId: t.Optional(t.String()),
				images: t.Optional(t.Files()),
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
