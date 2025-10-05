import { Elysia, t } from "elysia";
import {
	createCourse,
	findCourseById,
	findCourseBySlug,
	findCourses,
} from "../services/courses";
import { verifyToken } from "../services/jwt";
import { findUserById } from "../services/users";

export const coursesRouter = new Elysia({ prefix: "/courses" })
	.get(
		"/",
		async ({ query }) => {
			const courses = await findCourses({
				instructorId: query.instructorId,
				category: query.category,
				isPublished:
					query.isPublished === "true"
						? true
						: query.isPublished === "false"
							? false
							: undefined, // Show all if not specified
			});

			return { courses };
		},
		{
			query: t.Object({
				instructorId: t.Optional(t.String()),
				category: t.Optional(t.String()),
				isPublished: t.Optional(t.String()),
			}),
		},
	)
	.get("/:id", async ({ params, status, headers }) => {
		const course = await findCourseById(params.id);

		if (!course) {
			return status(404, {
				error: "Course not found",
			});
		}

		// Check if user is admin
		let isAdmin = false;
		const token = headers.authorization?.split(" ")[1];
		if (token) {
			try {
				const userId = await verifyToken(token);
				const user = await findUserById(userId);
				isAdmin = user?.role === "ADMIN";
			} catch {
				// Token is invalid, treat as non-admin
			}
		}

		// Only show published courses to non-admin users
		if (!course.isPublished && !isAdmin) {
			return status(404, {
				error: "Course not found",
			});
		}

		return { course };
	})
	.get("/slug/:slug", async ({ params, status }) => {
		const course = await findCourseBySlug(params.slug);

		if (!course) {
			return status(404, {
				error: "Course not found",
			});
		}

		// Only show published courses to non-admin users
		if (!course.isPublished) {
			return status(404, {
				error: "Course not found",
			});
		}

		return { course };
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
			const user = await findUserById(userId);

			if (!user) {
				return status(404, {
					error: "User not found",
				});
			}

			// Only admin users can create courses
			if (user.role !== "ADMIN") {
				return status(403, {
					error: "Forbidden - Only admin users can create courses",
				});
			}

			const {
				title,
				description,
				slug,
				thumbnailUrl,
				isPublished,
				isPrivate,
				price,
				currency,
				tags,
				category,
			} = body;

			// Check if slug already exists
			const existingCourse = await findCourseBySlug(slug);
			if (existingCourse) {
				return status(409, {
					error: "Course with this slug already exists",
				});
			}

			const course = await createCourse({
				title,
				description: description || null,
				slug,
				thumbnailUrl: thumbnailUrl || null,
				isPublished: isPublished || false,
				isPrivate: isPrivate || false,
				price: price || null,
				currency: currency || "USD",
				tags: tags || [],
				category: category || null,
				instructorId: userId,
			});

			return status(201, { course });
		},
		{
			body: t.Object({
				title: t.String({ minLength: 1, maxLength: 200 }),
				description: t.Optional(t.String({ maxLength: 2000 })),
				slug: t.String({ minLength: 1, maxLength: 100 }),
				thumbnailUrl: t.Optional(t.String()),
				isPublished: t.Optional(t.Boolean()),
				isPrivate: t.Optional(t.Boolean()),
				price: t.Optional(t.Number({ minimum: 0 })),
				currency: t.Optional(t.String({ minLength: 3, maxLength: 3 })),
				tags: t.Optional(t.Array(t.String())),
				category: t.Optional(t.String({ maxLength: 100 })),
			}),
		},
	)
	.post(
		"/:courseId/sections",
		async ({ params, body, headers, status }) => {
			const token = headers.authorization?.split(" ")[1];

			if (!token) {
				return status(401, {
					error: "Unauthorized",
				});
			}

			const userId = await verifyToken(token);
			const user = await findUserById(userId);

			if (!user) {
				return status(404, {
					error: "User not found",
				});
			}

			// Only admin users can create sections
			if (user.role !== "ADMIN") {
				return status(403, {
					error: "Forbidden - Only admin users can create sections",
				});
			}

			const { title, order } = body;

			// Create section using Prisma directly
			const { prisma } = await import("@betterlms/database");
			const section = await prisma.section.create({
				data: {
					title,
					order: order || 0,
					courseId: params.courseId,
				},
				include: {
					lessons: {
						orderBy: {
							order: "asc",
						},
					},
				},
			});

			return status(201, { section });
		},
		{
			body: t.Object({
				title: t.String({ minLength: 1, maxLength: 200 }),
				order: t.Optional(t.Number()),
			}),
		},
	)
	.post(
		"/:courseId/sections/:sectionId/lessons",
		async ({ params, body, headers, status }) => {
			const token = headers.authorization?.split(" ")[1];

			if (!token) {
				return status(401, {
					error: "Unauthorized",
				});
			}

			const userId = await verifyToken(token);
			const user = await findUserById(userId);

			if (!user) {
				return status(404, {
					error: "User not found",
				});
			}

			// Only admin users can create lessons
			if (user.role !== "ADMIN") {
				return status(403, {
					error: "Forbidden - Only admin users can create lessons",
				});
			}

			const { title, content, order, type, videoUrl, isFree } = body;

			// Create lesson using Prisma directly
			const { prisma } = await import("@betterlms/database");
			const lesson = await prisma.lesson.create({
				data: {
					title,
					content: content || null,
					order: order || 0,
					type: type || "TEXT",
					videoUrl: videoUrl || null,
					isFree: isFree || false,
					sectionId: params.sectionId,
				},
			});

			return status(201, { lesson });
		},
		{
			body: t.Object({
				title: t.String({ minLength: 1, maxLength: 200 }),
				content: t.Optional(t.String()),
				order: t.Optional(t.Number()),
				type: t.Optional(t.Union([t.Literal("VIDEO"), t.Literal("TEXT")])),
				videoUrl: t.Optional(t.String()),
				isFree: t.Optional(t.Boolean()),
			}),
		},
	);
