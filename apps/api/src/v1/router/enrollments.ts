import {
	createEnrollment,
	deleteEnrollment,
	findCourseById,
	findEnrollmentById,
	findEnrollmentByUserAndCourse,
	findEnrollments,
	findUserById,
	updateEnrollmentProgress,
	updateEnrollmentStatus,
	verifyToken,
} from "@betterlms/core";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";

const enrollmentsRouter = new Hono();

enrollmentsRouter.get(
	"/enrollments",
	zValidator(
		"query",
		z.object({
			userId: z.string().optional(),
			courseId: z.string().optional(),
			status: z
				.enum(["ACTIVE", "COMPLETED", "CANCELLED", "SUSPENDED"])
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
		const user = await findUserById(userId);

		if (!user) {
			return c.json(
				{
					error: "User not found",
				},
				404,
			);
		}

		// Only admin users can view all enrollments
		if (user.role !== "ADMIN") {
			return c.json(
				{
					error: "Forbidden - Only admin users can view all enrollments",
				},
				403,
			);
		}

		const query = c.req.valid("query");
		const enrollments = await findEnrollments({
			...(query.userId && { userId: query.userId }),
			...(query.courseId && { courseId: query.courseId }),
			...(query.status && { status: query.status }),
		});

		return c.json({ enrollments });
	},
);

enrollmentsRouter.get("/enrollments/my-enrollments", async (c) => {
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
	const enrollments = await findEnrollments({ userId });

	return c.json({ enrollments });
});

enrollmentsRouter.get("/enrollments/:id", async (c) => {
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

	const enrollment = await findEnrollmentById(c.req.param("id"));

	if (!enrollment) {
		return c.json(
			{
				error: "Enrollment not found",
			},
			404,
		);
	}

	// Users can only view their own enrollments unless they're admin
	if (enrollment.userId !== userId && user.role !== "ADMIN") {
		return c.json(
			{
				error: "Forbidden - You can only view your own enrollments",
			},
			403,
		);
	}

	return c.json({ enrollment });
});

enrollmentsRouter.post(
	"/enrollments",
	zValidator(
		"json",
		z.object({
			courseId: z.string(),
			amountPaid: z.number().min(0).optional(),
			currency: z.string().min(3).max(3).optional(),
			paymentMethod: z.string().optional(),
			transactionId: z.string().optional(),
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
		const body = c.req.valid("json");
		const { courseId, amountPaid, currency, paymentMethod, transactionId } =
			body;

		// Check if course exists
		const course = await findCourseById(courseId);
		if (!course) {
			return c.json(
				{
					error: "Course not found",
				},
				404,
			);
		}

		// Check if course is published
		if (!course.isPublished) {
			return c.json(
				{
					error: "Cannot enroll in unpublished course",
				},
				400,
			);
		}

		// Check if user is already enrolled
		const existingEnrollment = await findEnrollmentByUserAndCourse(
			userId,
			courseId,
		);
		if (existingEnrollment) {
			return c.json(
				{
					error: "Already enrolled in this course",
				},
				409,
			);
		}

		const enrollment = await createEnrollment({
			userId,
			courseId,
			...(amountPaid !== undefined && { amountPaid }),
			...(currency && { currency }),
			...(paymentMethod && { paymentMethod }),
			...(transactionId && { transactionId }),
		});

		return c.json({ enrollment }, 201);
	},
);

enrollmentsRouter.put(
	"/enrollments/:id/status",
	zValidator(
		"json",
		z.object({
			status: z.enum(["ACTIVE", "COMPLETED", "CANCELLED", "SUSPENDED"]),
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

		// Only admin users can update enrollment status
		if (user.role !== "ADMIN") {
			return c.json(
				{
					error: "Forbidden - Only admin users can update enrollment status",
				},
				403,
			);
		}

		const enrollment = await findEnrollmentById(c.req.param("id"));

		if (!enrollment) {
			return c.json(
				{
					error: "Enrollment not found",
				},
				404,
			);
		}

		const body = c.req.valid("json");
		const updatedEnrollment = await updateEnrollmentStatus(
			c.req.param("id"),
			body.status,
		);

		return c.json({ enrollment: updatedEnrollment });
	},
);

enrollmentsRouter.put(
	"/enrollments/:id/progress",
	zValidator(
		"json",
		z.object({
			progressPercentage: z.number().min(0).max(100).optional(),
			currentLessonId: z.string().optional(),
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
		const enrollment = await findEnrollmentById(c.req.param("id"));

		if (!enrollment) {
			return c.json(
				{
					error: "Enrollment not found",
				},
				404,
			);
		}

		// Users can only update their own enrollment progress
		if (enrollment.userId !== userId) {
			return c.json(
				{
					error: "Forbidden - You can only update your own enrollment progress",
				},
				403,
			);
		}

		const body = c.req.valid("json");
		const { progressPercentage, currentLessonId } = body;

		const updatedEnrollment = await updateEnrollmentProgress(
			c.req.param("id"),
			{
				...(progressPercentage !== undefined && { progressPercentage }),
				...(currentLessonId && { currentLessonId }),
			},
		);

		return c.json({ enrollment: updatedEnrollment });
	},
);

enrollmentsRouter.delete("/enrollments/:id", async (c) => {
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

	const enrollment = await findEnrollmentById(c.req.param("id"));

	if (!enrollment) {
		return c.json(
			{
				error: "Enrollment not found",
			},
			404,
		);
	}

	// Users can only delete their own enrollments unless they're admin
	if (enrollment.userId !== userId && user.role !== "ADMIN") {
		return c.json(
			{
				error: "Forbidden - You can only delete your own enrollments",
			},
			403,
		);
	}

	await deleteEnrollment(c.req.param("id"));

	return c.json({ message: "Enrollment deleted successfully" });
});

export { enrollmentsRouter };
