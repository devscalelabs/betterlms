import { prisma } from "@betterlms/database";
import type { Prisma } from "@betterlms/database/generated/prisma";

export async function findCourses(filters: {
	instructorId?: string | undefined;
	category?: string | undefined;
	isPublished?: boolean | undefined;
}) {
	const whereClause: Prisma.CourseWhereInput = {};

	if (filters.instructorId) {
		whereClause.instructorId = filters.instructorId;
	}

	if (filters.category) {
		whereClause.category = filters.category;
	}

	if (filters.isPublished !== undefined) {
		whereClause.isPublished = filters.isPublished;
	}

	return await prisma.course.findMany({
		where: whereClause,
		include: {
			instructor: {
				select: {
					id: true,
					name: true,
					username: true,
					imageUrl: true,
				},
			},
			sections: {
				include: {
					lessons: {
						select: {
							id: true,
							title: true,
							order: true,
							type: true,
							isFree: true,
						},
						orderBy: {
							order: "asc",
						},
					},
				},
				orderBy: {
					order: "asc",
				},
			},
			_count: {
				select: {
					enrollments: true,
				},
			},
		},
		orderBy: {
			createdAt: "desc",
		},
	});
}

export async function findCourseById(id: string) {
	return await prisma.course.findUnique({
		where: { id },
		include: {
			instructor: {
				select: {
					id: true,
					name: true,
					username: true,
					imageUrl: true,
				},
			},
			sections: {
				include: {
					lessons: {
						select: {
							id: true,
							title: true,
							content: true,
							order: true,
							type: true,
							videoUrl: true,
							isFree: true,
						},
						orderBy: {
							order: "asc",
						},
					},
				},
				orderBy: {
					order: "asc",
				},
			},
			_count: {
				select: {
					enrollments: true,
				},
			},
		},
	});
}

export async function findCourseBySlug(slug: string) {
	return await prisma.course.findUnique({
		where: { slug },
		include: {
			instructor: {
				select: {
					id: true,
					name: true,
					username: true,
					imageUrl: true,
				},
			},
			sections: {
				include: {
					lessons: {
						select: {
							id: true,
							title: true,
							content: true,
							order: true,
							type: true,
							videoUrl: true,
							isFree: true,
						},
						orderBy: {
							order: "asc",
						},
					},
				},
				orderBy: {
					order: "asc",
				},
			},
			_count: {
				select: {
					enrollments: true,
				},
			},
		},
	});
}

export async function createCourse(data: {
	title: string;
	description?: string | null;
	slug: string;
	thumbnailUrl?: string | null;
	isPublished?: boolean;
	isPrivate?: boolean;
	price?: number | null;
	currency?: string;
	tags?: string[];
	category?: string | null;
	instructorId: string;
}) {
	return await prisma.course.create({
		data: {
			title: data.title,
			description: data.description || null,
			slug: data.slug,
			thumbnailUrl: data.thumbnailUrl || null,
			isPublished: data.isPublished || false,
			isPrivate: data.isPrivate || false,
			price: data.price ? data.price : null,
			currency: data.currency || "USD",
			tags: data.tags || [],
			category: data.category || null,
			instructorId: data.instructorId,
		},
		include: {
			instructor: {
				select: {
					id: true,
					name: true,
					username: true,
					imageUrl: true,
				},
			},
			sections: {
				include: {
					lessons: {
						select: {
							id: true,
							title: true,
							order: true,
							type: true,
							isFree: true,
						},
						orderBy: {
							order: "asc",
						},
					},
				},
				orderBy: {
					order: "asc",
				},
			},
			_count: {
				select: {
					enrollments: true,
				},
			},
		},
	});
}
