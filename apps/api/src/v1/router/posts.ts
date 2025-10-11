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
	findUserById,
	incrementPostLikeCount,
	verifyToken,
} from "@betterlms/core";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";
import { uploadImageToS3 } from "../../utils/upload-files";

const postsRouter = new Hono();

postsRouter.get(
	"/posts/",
	zValidator(
		"query",
		z.object({
			parentId: z.string().optional(),
			username: z.string().optional(),
			channelSlug: z.string().optional(),
			excludeArticles: z.string().optional(),
		}),
	),
	async (c) => {
		const query = c.req.valid("query");
		// Optionally get userId if user is authenticated
		let userId: string | undefined;
		const token = c.req.header("authorization")?.split(" ")[1];
		if (token) {
			try {
				userId = await verifyToken(token);
			} catch {
				// If token is invalid, just continue without userId
				userId = undefined;
			}
		}

		const posts = await findPosts({
			parentId: query.parentId,
			username: query.username,
			channelSlug: query.channelSlug,
			excludeArticles: query.excludeArticles !== "false", // Default to true unless explicitly set to false
		});

		// Process posts to get unique commenters (first 3) and check if user liked
		const postsWithCommentPreview = await Promise.all(
			posts.map(async (post: any) => {
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

				// Check if current user has liked this post
				let isLiked = false;
				if (userId) {
					const like = await findPostLike(userId, post.id);
					isLiked = !!like;
				}

				const { children: _children, ...postData } = post;

				return {
					...postData,
					isLiked,
					commentPreview: {
						users: Array.from(uniqueCommenters.values()),
						totalCount: post.replyCount,
					},
				};
			}),
		);

		return c.json({ posts: postsWithCommentPreview });
	},
);

postsRouter.get("/posts/:id/", async (c) => {
	// Optionally get userId if user is authenticated
	let userId: string | undefined;
	const token = c.req.header("authorization")?.split(" ")[1];
	if (token) {
		try {
			userId = await verifyToken(token);
		} catch {
			// If token is invalid, just continue without userId
			userId = undefined;
		}
	}

	const post = await findPostById(c.req.param("id"));

	if (!post) {
		return c.json(
			{
				error: "Post not found",
			},
			404,
		);
	}

	// Process post to get unique commenters (first 3)
	const uniqueCommenters = new Map();

	for (const child of post.children) {
		if (child.user && child.userId && !uniqueCommenters.has(child.userId)) {
			uniqueCommenters.set(child.userId, child.user);
			if (uniqueCommenters.size === 3) break;
		}
	}

	// Check if current user has liked this post
	let isLiked = false;
	if (userId) {
		const like = await findPostLike(userId, post.id);
		isLiked = !!like;
	}

	const { children: _children, ...postData } = post;

	const postWithCommentPreview = {
		...postData,
		isLiked,
		commentPreview: {
			users: Array.from(uniqueCommenters.values()),
			totalCount: post.replyCount,
		},
	};

	return c.json({ post: postWithCommentPreview });
});

postsRouter.post(
	"/posts/",
	zValidator(
		"form",
		z.object({
			content: z.string().min(1).max(5000),
			channelId: z.string().optional(),
			parentId: z.string().optional(),
			images: z
				.union([
					z.array(z.instanceof(File)),
					z.instanceof(File).transform((file) => [file]),
				])
				.optional(),
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
		const { content, channelId, parentId, images } = body;

		const post = await createPost({
			title: null, // Explicitly set to null for posts
			content,
			channelId,
			parentId,
			userId,
		});

		if (images && images.length > 0) {
			console.log(`Uploading ${images.length} image(s) to S3...`);

			const mediaRecords = await Promise.all(
				images.map(async (image: File) => {
					const url = await uploadImageToS3(image, userId);
					console.log(`Uploaded: ${image.name} -> ${url}`);

					return createMedia(url, userId, post.id);
				}),
			);

			console.log(`Created ${mediaRecords.length} media record(s)`);

			const postWithMedia = await findPostWithMedia(post.id);

			return c.json({ post: postWithMedia }, 201);
		}

		return c.json({ post }, 201);
	},
);

postsRouter.delete("/posts/:id/", async (c) => {
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
	const user = await findUserById(userId);
	const post = await findPostById(c.req.param("id"));

	if (!user) {
		return c.json(
			{
				error: "User not found",
			},
			404,
		);
	}

	if (!post) {
		return c.json(
			{
				error: "Post not found",
			},
			404,
		);
	}

	// Allow admins to delete any post, regular users can only delete their own
	if (user.role !== "ADMIN" && post.userId !== userId) {
		return c.json(
			{
				error: "Forbidden - You can only delete your own posts",
			},
			403,
		);
	}

	await deletePost(c.req.param("id"));

	return c.json({ message: "Post deleted successfully" });
});

postsRouter.post("/posts/:id/like/", async (c) => {
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
	const post = await findPostById(c.req.param("id"));

	if (!post) {
		return c.json(
			{
				error: "Post not found",
			},
			404,
		);
	}

	const existingLike = await findPostLike(userId, c.req.param("id"));

	if (existingLike) {
		return c.json(
			{
				error: "Post already liked",
			},
			409,
		);
	}

	await createPostLike(userId, c.req.param("id"));
	await incrementPostLikeCount(c.req.param("id"));

	return c.json({ message: "Post liked successfully" }, 201);
});

postsRouter.delete("/posts/:id/like/", async (c) => {
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
	const existingLike = await findPostLike(userId, c.req.param("id"));

	if (!existingLike) {
		return c.json(
			{
				error: "Like not found",
			},
			404,
		);
	}

	await deletePostLike(userId, c.req.param("id"));
	await decrementPostLikeCount(c.req.param("id"));

	return c.json({ message: "Post unliked successfully" });
});

export { postsRouter };
