import { prisma } from "@betterlms/database";
import type { Prisma } from "@betterlms/database/generated/prisma";
import { processMentions } from "../../utils/extract-mentions";

export async function findPosts(filters: {
	parentId?: string | undefined;
	username?: string | undefined;
	channelSlug?: string | undefined;
	excludeArticles?: boolean | undefined;
	articlesOnly?: boolean | undefined;
}) {
	const whereClause: Prisma.PostWhereInput = {
		isDeleted: false,
	};

	// Handle articles filtering
	if (filters.articlesOnly) {
		// Only return posts with titles (articles)
		whereClause.title = { not: null };
	} else if (filters.excludeArticles !== false) {
		// Exclude articles (posts with titles) by default
		whereClause.title = null;
	}

	if (filters.parentId) {
		whereClause.parentId = filters.parentId;
	} else if (!filters.username && !filters.channelSlug) {
		whereClause.parentId = null;
	}

	if (filters.username) {
		whereClause.user = {
			username: filters.username,
		};
	}

	if (filters.channelSlug) {
		whereClause.channel = {
			slug: filters.channelSlug,
		};
	}

	return await prisma.post.findMany({
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
}

export async function findPostById(id: string) {
	return await prisma.post.findUnique({
		where: {
			id,
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
}

export async function createPost(data: {
	title?: string | null | undefined;
	content: string;
	channelId?: string | null | undefined;
	parentId?: string | null | undefined;
	userId: string;
}) {
	// TODO: Process mentions in post content
	// TODO: Implement mention notification system
	// TODO: Add mention validation and database storage
	const mentions = processMentions(data.content);

	if (mentions.length > 0) {
		console.log(
			`[MENTION DETECTED] Post by user ${data.userId} mentions:`,
			mentions,
		);
		// TODO: Send notifications to mentioned users
		// TODO: Store mention relationships in database
		// TODO: Validate that mentioned users exist
	}

	return await prisma.post.create({
		data: {
			title: data.title || null,
			content: data.content,
			channelId: data.channelId || null,
			parentId: data.parentId || null,
			userId: data.userId,
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
}

export async function createMedia(url: string, userId: string, postId: string) {
	return await prisma.media.create({
		data: {
			url,
			type: "IMAGE",
			userId,
			postId,
		},
	});
}

export async function findPostWithMedia(postId: string) {
	return await prisma.post.findUnique({
		where: { id: postId },
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
}

export async function deletePost(id: string) {
	return await prisma.$transaction(async (tx) => {
		// First, delete all likes associated with this post
		await tx.postLike.deleteMany({
			where: { postId: id },
		});

		// Delete all media associated with this post
		await tx.media.deleteMany({
			where: { postId: id },
		});

		// Delete all child posts (comments) associated with this post
		await tx.post.deleteMany({
			where: { parentId: id },
		});

		// Finally, delete the post itself
		return await tx.post.delete({
			where: { id },
		});
	});
}

export async function findPostLike(userId: string, postId: string) {
	return await prisma.postLike.findUnique({
		where: {
			userId_postId: {
				userId,
				postId,
			},
		},
	});
}

export async function createPostLike(userId: string, postId: string) {
	return await prisma.postLike.create({
		data: {
			userId,
			postId,
		},
	});
}

export async function incrementPostLikeCount(postId: string) {
	return await prisma.post.update({
		where: { id: postId },
		data: {
			likeCount: {
				increment: 1,
			},
		},
	});
}

export async function deletePostLike(userId: string, postId: string) {
	return await prisma.postLike.delete({
		where: {
			userId_postId: {
				userId,
				postId,
			},
		},
	});
}

export async function decrementPostLikeCount(postId: string) {
	return await prisma.post.update({
		where: { id: postId },
		data: {
			likeCount: {
				decrement: 1,
			},
		},
	});
}

export async function updatePost(
	id: string,
	data: {
		title?: string | null;
		content?: string;
		channelId?: string | null;
	},
) {
	const updateData: {
		updatedAt: Date;
		title?: string | null;
		content?: string;
		channelId?: string | null;
	} = {
		updatedAt: new Date(),
	};

	if (data.title !== undefined) updateData.title = data.title;
	if (data.content !== undefined) updateData.content = data.content;
	if (data.channelId !== undefined) updateData.channelId = data.channelId;

	return await prisma.post.update({
		where: { id },
		data: updateData,
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
}
