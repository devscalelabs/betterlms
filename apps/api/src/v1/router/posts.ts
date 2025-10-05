import { prisma } from "@betterlms/database";
import type { Prisma } from "@betterlms/database/generated/prisma";
import { Elysia, t } from "elysia";
import * as jose from "jose";
import { uploadImageToS3 } from "../../utils/upload-files";

export const postsRouter = new Elysia({ prefix: "/posts" })
	.decorate("db", prisma)
	.get(
		"/",
		async ({ db, query }) => {
			// Get all public posts (not deleted)
			// If parentId query param is provided, get replies for that post
			// If username query param is provided, get posts by that user
			// If channelSlug query param is provided, get posts in that channel
			// Otherwise, get top-level posts only
			const whereClause: Prisma.PostWhereInput = {
				isDeleted: false,
			};

			if (query.parentId) {
				whereClause.parentId = query.parentId;
			} else if (!query.username && !query.channelSlug) {
				whereClause.parentId = null;
			}

			if (query.username) {
				whereClause.user = {
					username: query.username,
				};
			}

			if (query.channelSlug) {
				whereClause.channel = {
					slug: query.channelSlug,
				};
			}

			const posts = await db.post.findMany({
				where: whereClause,
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
							slug: true,
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
					children: {
						where: {
							isDeleted: false,
						},
						select: {
							id: true,
							userId: true,
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
				orderBy: {
					createdAt: "desc",
				},
			});

			// Process posts to get unique commenters (first 3)
			const postsWithCommentPreview = posts.map((post) => {
				const uniqueCommenters = new Map();

				for (const child of post.children) {
					if (
						child.user &&
						child.userId &&
						!uniqueCommenters.has(child.userId)
					) {
						uniqueCommenters.set(child.userId, child.user);
						if (uniqueCommenters.size === 3) break;
					}
				}

				const { children: _children, ...postData } = post;

				return {
					...postData,
					commentPreview: {
						users: Array.from(uniqueCommenters.values()),
						totalCount: post.replyCount,
					},
				};
			});

			return { posts: postsWithCommentPreview };
		},
		{
			query: t.Object({
				parentId: t.Optional(t.String()),
				username: t.Optional(t.String()),
				channelSlug: t.Optional(t.String()),
			}),
		},
	)
	.get("/:id", async ({ params, db, status }) => {
		const post = await db.post.findUnique({
			where: {
				id: params.id,
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
						slug: true,
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
				children: {
					where: {
						isDeleted: false,
					},
					select: {
						id: true,
						userId: true,
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

		if (!post) {
			return status(404, {
				error: "Post not found",
			});
		}

		// Process post to get unique commenters (first 3)
		const uniqueCommenters = new Map();

		for (const child of post.children) {
			if (child.user && child.userId && !uniqueCommenters.has(child.userId)) {
				uniqueCommenters.set(child.userId, child.user);
				if (uniqueCommenters.size === 3) break;
			}
		}

		const { children: _children, ...postData } = post;

		const postWithCommentPreview = {
			...postData,
			commentPreview: {
				users: Array.from(uniqueCommenters.values()),
				totalCount: post.replyCount,
			},
		};

		return { post: postWithCommentPreview };
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

			const { title, content, channelId, parentId, images } = body;
			const userId = decoded.payload.id as string;

			// Create post
			const post = await db.post.create({
				data: {
					title: title || null,
					content,
					channelId: channelId || null,
					parentId: parentId || null,
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
							slug: true,
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
								slug: true,
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
				parentId: t.Optional(t.String()),
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
	})
	.post("/:id/like", async ({ params, db, headers, status }) => {
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

		const userId = decoded.payload.id as string;

		// Check if post exists
		const post = await db.post.findUnique({
			where: { id: params.id },
		});

		if (!post) {
			return status(404, {
				error: "Post not found",
			});
		}

		// Check if user already liked the post
		const existingLike = await db.postLike.findUnique({
			where: {
				userId_postId: {
					userId,
					postId: params.id,
				},
			},
		});

		if (existingLike) {
			return status(409, {
				error: "Post already liked",
			});
		}

		// Create like and update like count
		await db.postLike.create({
			data: {
				userId,
				postId: params.id,
			},
		});

		await db.post.update({
			where: { id: params.id },
			data: {
				likeCount: {
					increment: 1,
				},
			},
		});

		return status(201, { message: "Post liked successfully" });
	})
	.delete("/:id/like", async ({ params, db, headers, status }) => {
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

		const userId = decoded.payload.id as string;

		// Check if like exists
		const existingLike = await db.postLike.findUnique({
			where: {
				userId_postId: {
					userId,
					postId: params.id,
				},
			},
		});

		if (!existingLike) {
			return status(404, {
				error: "Like not found",
			});
		}

		// Delete like and update like count
		await db.postLike.delete({
			where: {
				userId_postId: {
					userId,
					postId: params.id,
				},
			},
		});

		await db.post.update({
			where: { id: params.id },
			data: {
				likeCount: {
					decrement: 1,
				},
			},
		});

		return { message: "Post unliked successfully" };
	});
