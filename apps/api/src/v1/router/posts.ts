import { Elysia, t } from "elysia";
import { uploadImageToS3 } from "../../utils/upload-files";
import { verifyToken } from "../services/jwt";
import {
	createMedia,
	createPost,
	createPostLike,
	decrementPostLikeCount,
	deletePost,
	deletePostLike,
	findPostById,
	findPostLike,
	findPosts,
	findPostWithMedia,
	incrementPostLikeCount,
} from "../services/posts";

export const postsRouter = new Elysia({ prefix: "/posts" })
	.get(
		"/",
		async ({ query }) => {
			const posts = await findPosts({
				parentId: query.parentId,
				username: query.username,
				channelSlug: query.channelSlug,
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
	.get("/:id", async ({ params, status }) => {
		const post = await findPostById(params.id);

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
		async ({ body, headers, status }) => {
			const token = headers.authorization?.split(" ")[1];

			if (!token) {
				return status(401, {
					error: "Unauthorized",
				});
			}

			const userId = await verifyToken(token);
			const { title, content, channelId, parentId, images } = body;

			const post = await createPost({
				title,
				content,
				channelId,
				parentId,
				userId,
			});

			if (images && images.length > 0) {
				console.log(`Uploading ${images.length} image(s) to S3...`);

				const mediaRecords = await Promise.all(
					images.map(async (image) => {
						const url = await uploadImageToS3(image, userId);
						console.log(`Uploaded: ${image.name} -> ${url}`);

						return createMedia(url, userId, post.id);
					}),
				);

				console.log(`Created ${mediaRecords.length} media record(s)`);

				const postWithMedia = await findPostWithMedia(post.id);

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
	.delete("/:id", async ({ params, headers, status }) => {
		const token = headers.authorization?.split(" ")[1];

		if (!token) {
			return status(401, {
				error: "Unauthorized",
			});
		}

		const userId = await verifyToken(token);
		const post = await findPostById(params.id);

		if (!post) {
			return status(404, {
				error: "Post not found",
			});
		}

		if (post.userId !== userId) {
			return status(403, {
				error: "Forbidden - You can only delete your own posts",
			});
		}

		await deletePost(params.id);

		return { message: "Post deleted successfully" };
	})
	.post("/:id/like", async ({ params, headers, status }) => {
		const token = headers.authorization?.split(" ")[1];

		if (!token) {
			return status(401, {
				error: "Unauthorized",
			});
		}

		const userId = await verifyToken(token);
		const post = await findPostById(params.id);

		if (!post) {
			return status(404, {
				error: "Post not found",
			});
		}

		const existingLike = await findPostLike(userId, params.id);

		if (existingLike) {
			return status(409, {
				error: "Post already liked",
			});
		}

		await createPostLike(userId, params.id);
		await incrementPostLikeCount(params.id);

		return status(201, { message: "Post liked successfully" });
	})
	.delete("/:id/like", async ({ params, headers, status }) => {
		const token = headers.authorization?.split(" ")[1];

		if (!token) {
			return status(401, {
				error: "Unauthorized",
			});
		}

		const userId = await verifyToken(token);
		const existingLike = await findPostLike(userId, params.id);

		if (!existingLike) {
			return status(404, {
				error: "Like not found",
			});
		}

		await deletePostLike(userId, params.id);
		await decrementPostLikeCount(params.id);

		return { message: "Post unliked successfully" };
	});
