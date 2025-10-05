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

export const articlesRouter = new Elysia({ prefix: "/articles" })
	.get(
		"/",
		async ({ query, headers }) => {
			// Optionally get userId if user is authenticated
			let userId: string | undefined;
			const token = headers.authorization?.split(" ")[1];
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
				articles.map(async (article) => {
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

			return { articles: articlesWithCommentPreview };
		},
		{
			query: t.Object({
				parentId: t.Optional(t.String()),
				username: t.Optional(t.String()),
				channelSlug: t.Optional(t.String()),
			}),
		},
	)
	.get("/:id", async ({ params, status, headers }) => {
		// Optionally get userId if user is authenticated
		let userId: string | undefined;
		const token = headers.authorization?.split(" ")[1];
		if (token) {
			try {
				userId = await verifyToken(token);
			} catch {
				// If token is invalid, just continue without userId
				userId = undefined;
			}
		}

		const article = await findPostById(params.id);

		if (!article) {
			return status(404, {
				error: "Article not found",
			});
		}

		// Check if it's actually an article (has title)
		if (!article.title) {
			return status(404, {
				error: "Article not found",
			});
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

		return { article: articleWithCommentPreview };
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

			// Ensure title is provided for articles
			if (!title || title.trim().length === 0) {
				return status(400, {
					error: "Title is required for articles",
				});
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
					images.map(async (image) => {
						const url = await uploadImageToS3(image, userId);
						console.log(`Uploaded: ${image.name} -> ${url}`);

						return createMedia(url, userId, article.id);
					}),
				);

				console.log(`Created ${mediaRecords.length} media record(s)`);

				const articleWithMedia = await findPostWithMedia(article.id);

				return status(201, { article: articleWithMedia });
			}

			return status(201, { article });
		},
		{
			body: t.Object({
				title: t.String({ minLength: 1, maxLength: 200 }),
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
		const article = await findPostById(params.id);

		if (!article) {
			return status(404, {
				error: "Article not found",
			});
		}

		// Check if it's actually an article (has title)
		if (!article.title) {
			return status(404, {
				error: "Article not found",
			});
		}

		if (article.userId !== userId) {
			return status(403, {
				error: "Forbidden - You can only delete your own articles",
			});
		}

		await deletePost(params.id);

		return { message: "Article deleted successfully" };
	})
	.post("/:id/like", async ({ params, headers, status }) => {
		const token = headers.authorization?.split(" ")[1];

		if (!token) {
			return status(401, {
				error: "Unauthorized",
			});
		}

		const userId = await verifyToken(token);
		const article = await findPostById(params.id);

		if (!article) {
			return status(404, {
				error: "Article not found",
			});
		}

		// Check if it's actually an article (has title)
		if (!article.title) {
			return status(404, {
				error: "Article not found",
			});
		}

		const existingLike = await findPostLike(userId, params.id);

		if (existingLike) {
			return status(409, {
				error: "Article already liked",
			});
		}

		await createPostLike(userId, params.id);
		await incrementPostLikeCount(params.id);

		return status(201, { message: "Article liked successfully" });
	})
	.delete("/:id/like", async ({ params, headers, status }) => {
		const token = headers.authorization?.split(" ")[1];

		if (!token) {
			return status(401, {
				error: "Unauthorized",
			});
		}

		const userId = await verifyToken(token);
		const article = await findPostById(params.id);

		if (!article) {
			return status(404, {
				error: "Article not found",
			});
		}

		// Check if it's actually an article (has title)
		if (!article.title) {
			return status(404, {
				error: "Article not found",
			});
		}

		const existingLike = await findPostLike(userId, params.id);

		if (!existingLike) {
			return status(404, {
				error: "Like not found",
			});
		}

		await deletePostLike(userId, params.id);
		await decrementPostLikeCount(params.id);

		return { message: "Article unliked successfully" };
	});
