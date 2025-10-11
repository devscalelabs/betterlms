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
	updatePost,
	verifyToken,
} from "@betterlms/core";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";
import { uploadImageToS3 } from "../../utils/upload-files";

const articlesRouter = new Hono();

articlesRouter.get(
	"/articles/",
	zValidator(
		"query",
		z.object({
			parentId: z.string().optional(),
			username: z.string().optional(),
			channelSlug: z.string().optional(),
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

		const articles = await findPosts({
			parentId: query.parentId,
			username: query.username,
			channelSlug: query.channelSlug,
			articlesOnly: true, // Only return articles (posts with titles)
		});

		// Process articles to get unique commenters (first 3) and check if user liked
		const articlesWithCommentPreview = await Promise.all(
			articles.map(async (article: any) => {
				const uniqueCommenters = new Map();

				for (const child of article.children) {
					if (
						child.user &&
						child.userId &&
						!uniqueCommenters.has(child.userId)
					) {
						uniqueCommenters.set(child.userId, child.user);
						if (uniqueCommenters.size === 3) break;
					}
				}

				// Check if current user has liked this article
				let isLiked = false;
				if (userId) {
					const like = await findPostLike(userId, article.id);
					isLiked = !!like;
				}

				const { children: _children, ...articleData } = article;

				return {
					...articleData,
					isLiked,
					commentPreview: {
						users: Array.from(uniqueCommenters.values()),
						totalCount: article.replyCount,
					},
				};
			}),
		);

		return c.json({ articles: articlesWithCommentPreview });
	},
);

articlesRouter.get("/articles/:id/", async (c) => {
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

	const article = await findPostById(c.req.param("id"));

	if (!article) {
		return c.json(
			{
				error: "Article not found",
			},
			404,
		);
	}

	// Check if it's actually an article (has title)
	if (!article.title) {
		return c.json(
			{
				error: "Article not found",
			},
			404,
		);
	}

	// Process article to get unique commenters (first 3)
	const uniqueCommenters = new Map();

	for (const child of article.children) {
		if (child.user && child.userId && !uniqueCommenters.has(child.userId)) {
			uniqueCommenters.set(child.userId, child.user);
			if (uniqueCommenters.size === 3) break;
		}
	}

	// Check if current user has liked this article
	let isLiked = false;
	if (userId) {
		const like = await findPostLike(userId, article.id);
		isLiked = !!like;
	}

	const { children: _children, ...articleData } = article;

	const articleWithCommentPreview = {
		...articleData,
		isLiked,
		commentPreview: {
			users: Array.from(uniqueCommenters.values()),
			totalCount: article.replyCount,
		},
	};

	return c.json({ article: articleWithCommentPreview });
});

articlesRouter.post(
	"/articles/",
	zValidator(
		"form",
		z.object({
			title: z.string().min(1).max(200),
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
		const { title, content, channelId, parentId, images } = body;

		// Ensure title is provided for articles
		if (!title || title.trim().length === 0) {
			return c.json(
				{
					error: "Title is required for articles",
				},
				400,
			);
		}

		const article = await createPost({
			title,
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

					return createMedia(url, userId, article.id);
				}),
			);

			console.log(`Created ${mediaRecords.length} media record(s)`);

			const articleWithMedia = await findPostWithMedia(article.id);

			return c.json({ article: articleWithMedia }, 201);
		}

		return c.json({ article }, 201);
	},
);

articlesRouter.delete("/articles/:id/", async (c) => {
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
	const article = await findPostById(c.req.param("id"));

	if (!user) {
		return c.json(
			{
				error: "User not found",
			},
			404,
		);
	}

	if (!article) {
		return c.json(
			{
				error: "Article not found",
			},
			404,
		);
	}

	// Check if it's actually an article (has title)
	if (!article.title) {
		return c.json(
			{
				error: "Article not found",
			},
			404,
		);
	}

	// Allow admins to delete any article, regular users can only delete their own
	if (user.role !== "ADMIN" && article.userId !== userId) {
		return c.json(
			{
				error: "Forbidden - You can only delete your own articles",
			},
			403,
		);
	}

	await deletePost(c.req.param("id"));

	return c.json({ message: "Article deleted successfully" });
});

articlesRouter.put(
	"/articles/:id/",
	zValidator(
		"json",
		z.object({
			title: z.string().min(1).max(200),
			content: z.string().min(1).max(5000),
			channelId: z.string().optional(),
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
		const user = await findUserById(userId);
		const article = await findPostById(c.req.param("id"));
		const body = c.req.valid("json");

		if (!user) {
			return c.json(
				{
					error: "User not found",
				},
				404,
			);
		}

		if (!article) {
			return c.json(
				{
					error: "Article not found",
				},
				404,
			);
		}

		// Check if it's actually an article (has title)
		if (!article.title) {
			return c.json(
				{
					error: "Article not found",
				},
				404,
			);
		}

		// Allow admins to edit any article, regular users can only edit their own
		if (user.role !== "ADMIN" && article.userId !== userId) {
			return c.json(
				{
					error: "Forbidden - You can only edit your own articles",
				},
				403,
			);
		}

		const { title, content, channelId } = body;

		// Ensure title is provided for articles
		if (!title || title.trim().length === 0) {
			return c.json(
				{
					error: "Title is required for articles",
				},
				400,
			);
		}

		const updatedArticle = await updatePost(c.req.param("id"), {
			title,
			content,
			channelId: channelId || null,
		});

		return c.json({ article: updatedArticle });
	},
);

articlesRouter.post("/articles/:id/like/", async (c) => {
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
	const article = await findPostById(c.req.param("id"));

	if (!article) {
		return c.json(
			{
				error: "Article not found",
			},
			404,
		);
	}

	// Check if it's actually an article (has title)
	if (!article.title) {
		return c.json(
			{
				error: "Article not found",
			},
			404,
		);
	}

	const existingLike = await findPostLike(userId, c.req.param("id"));

	if (existingLike) {
		return c.json(
			{
				error: "Article already liked",
			},
			409,
		);
	}

	await createPostLike(userId, c.req.param("id"));
	await incrementPostLikeCount(c.req.param("id"));

	return c.json({ message: "Article liked successfully" }, 201);
});

articlesRouter.delete("/articles/:id/like/", async (c) => {
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
	const article = await findPostById(c.req.param("id"));

	if (!article) {
		return c.json(
			{
				error: "Article not found",
			},
			404,
		);
	}

	// Check if it's actually an article (has title)
	if (!article.title) {
		return c.json(
			{
				error: "Article not found",
			},
			404,
		);
	}

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

	return c.json({ message: "Article unliked successfully" });
});

export { articlesRouter };
