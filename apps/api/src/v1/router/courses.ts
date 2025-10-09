import {
	createCourse,
	findCourseById,
	findCourseBySlug,
	findCourses,
	findUserById,
	verifyToken,
} from "@betterlms/core";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";

const coursesRouter = new Hono();

coursesRouter.get(
	"/courses/",
	zValidator(
		"query",
		z.object({
			instructorId: z.string().optional(),
			category: z.string().optional(),
			isPublished: z.string().optional(),
		}),
	),
	async (c) => {
		const query = c.req.valid("query");
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

		return c.json({ courses });
	},
);

coursesRouter.get("/courses/:id/", async (c) => {
	const course = await findCourseById(c.req.param("id"));

	if (!course) {
		return c.json(
			{
				error: "Course not found",
			},
			404,
		);
	}

	// Check if user is admin
	let isAdmin = false;
	const token = c.req.header("authorization")?.split(" ")[1];
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
		return c.json(
			{
				error: "Course not found",
			},
			404,
		);
	}

	return c.json({ course });
});

coursesRouter.get("/courses/slug/:slug/", async (c) => {
	const course = await findCourseBySlug(c.req.param("slug"));

	if (!course) {
		return c.json(
			{
				error: "Course not found",
			},
			404,
		);
	}

	// Only show published courses to non-admin users
	if (!course.isPublished) {
		return c.json(
			{
				error: "Course not found",
			},
			404,
		);
	}

	return c.json({ course });
});

coursesRouter.post(
	"/courses/",
	zValidator(
		"json",
		z.object({
			title: z.string().min(1).max(200),
			description: z.string().max(2000).optional(),
			slug: z.string().min(1).max(100),
			thumbnailUrl: z.string().optional(),
			isPublished: z.boolean().optional(),
			isPrivate: z.boolean().optional(),
			price: z.number().min(0).optional(),
			currency: z.string().min(3).max(3).optional(),
			tags: z.array(z.string()).optional(),
			category: z.string().max(100).optional(),
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

		if (!user) {
			return c.json(
				{
					error: "User not found",
				},
				404,
			);
		}

		// Only admin users can create courses
		if (user.role !== "ADMIN") {
			return c.json(
				{
					error: "Forbidden - Only admin users can create courses",
				},
				403,
			);
		}

		const body = c.req.valid("json");
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
			return c.json(
				{
					error: "Course with this slug already exists",
				},
				409,
			);
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

		return c.json({ course }, 201);
	},
);

coursesRouter.post(
	"/courses/:courseId/sections/",
	zValidator(
		"json",
		z.object({
			title: z.string().min(1).max(200),
			order: z.number().optional(),
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

		if (!user) {
			return c.json(
				{
					error: "User not found",
				},
				404,
			);
		}

		// Only admin users can create sections
		if (user.role !== "ADMIN") {
			return c.json(
				{
					error: "Forbidden - Only admin users can create sections",
				},
				403,
			);
		}

		const body = c.req.valid("json");
		const { title, order } = body;

		// Create section using Prisma directly
		const { prisma } = await import("@betterlms/database");
		const section = await prisma.section.create({
			data: {
				title,
				order: order || 0,
				courseId: c.req.param("courseId"),
			},
			include: {
				lessons: {
					orderBy: {
						order: "asc",
					},
				},
			},
		});

		return c.json({ section }, 201);
	},
);

coursesRouter.post(
	"/courses/:courseId/sections/:sectionId/lessons/",
	zValidator(
		"json",
		z.object({
			title: z.string().min(1).max(200),
			content: z.string().optional(),
			order: z.number().optional(),
			type: z.enum(["VIDEO", "TEXT"]).optional(),
			videoUrl: z.string().optional(),
			isFree: z.boolean().optional(),
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

		if (!user) {
			return c.json(
				{
					error: "User not found",
				},
				404,
			);
		}

		// Only admin users can create lessons
		if (user.role !== "ADMIN") {
			return c.json(
				{
					error: "Forbidden - Only admin users can create lessons",
				},
				403,
			);
		}

		const body = c.req.valid("json");
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
				sectionId: c.req.param("sectionId"),
			},
		});

		return c.json({ lesson }, 201);
	},
);

export { coursesRouter };
