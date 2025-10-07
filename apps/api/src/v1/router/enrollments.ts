import { Elysia, t } from "elysia";
import { findCourseById } from "../services/courses";
import {
	createEnrollment,
	deleteEnrollment,
	findEnrollmentById,
	findEnrollmentByUserAndCourse,
	findEnrollments,
	updateEnrollmentProgress,
	updateEnrollmentStatus,
} from "../services/enrollments";
import { verifyToken } from "../services/jwt";
import { findUserById } from "../services/users";

export const enrollmentsRouter = new Elysia({ prefix: "/enrollments" })
	.get(
		"/",
		async ({ query, headers, status }) => {
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

			// Only admin users can view all enrollments
			if (user.role !== "ADMIN") {
				return status(403, {
					error: "Forbidden - Only admin users can view all enrollments",
				});
			}

			const enrollments = await findEnrollments({
				userId: query.userId,
				courseId: query.courseId,
				status: query.status as
					| "ACTIVE"
					| "COMPLETED"
					| "CANCELLED"
					| "SUSPENDED",
			});

			return { enrollments };
		},
		{
			query: t.Object({
				userId: t.Optional(t.String()),
				courseId: t.Optional(t.String()),
				status: t.Optional(t.String()),
			}),
		},
	)
	.get("/my-enrollments", async ({ headers, status }) => {
		const token = headers.authorization?.split(" ")[1];

		if (!token) {
			return status(401, {
				error: "Unauthorized",
			});
		}

		const userId = await verifyToken(token);
		const enrollments = await findEnrollments({ userId });

		return { enrollments };
	})
	.get("/:id", async ({ params, headers, status }) => {
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

		const enrollment = await findEnrollmentById(params.id);

		if (!enrollment) {
			return status(404, {
				error: "Enrollment not found",
			});
		}

		// Users can only view their own enrollments unless they're admin
		if (enrollment.userId !== userId && user.role !== "ADMIN") {
			return status(403, {
				error: "Forbidden - You can only view your own enrollments",
			});
		}

		return { enrollment };
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
			const { courseId, amountPaid, currency, paymentMethod, transactionId } =
				body;

			// Check if course exists
			const course = await findCourseById(courseId);
			if (!course) {
				return status(404, {
					error: "Course not found",
				});
			}

			// Check if course is published
			if (!course.isPublished) {
				return status(400, {
					error: "Cannot enroll in unpublished course",
				});
			}

			// Check if user is already enrolled
			const existingEnrollment = await findEnrollmentByUserAndCourse(
				userId,
				courseId,
			);
			if (existingEnrollment) {
				return status(409, {
					error: "Already enrolled in this course",
				});
			}

			const enrollment = await createEnrollment({
				userId,
				courseId,
				amountPaid,
				currency,
				paymentMethod,
				transactionId,
			});

			return status(201, { enrollment });
		},
		{
			body: t.Object({
				courseId: t.String(),
				amountPaid: t.Optional(t.Number({ minimum: 0 })),
				currency: t.Optional(t.String({ minLength: 3, maxLength: 3 })),
				paymentMethod: t.Optional(t.String()),
				transactionId: t.Optional(t.String()),
			}),
		},
	)
	.put(
		"/:id/status",
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

			// Only admin users can update enrollment status
			if (user.role !== "ADMIN") {
				return status(403, {
					error: "Forbidden - Only admin users can update enrollment status",
				});
			}

			const enrollment = await findEnrollmentById(params.id);

			if (!enrollment) {
				return status(404, {
					error: "Enrollment not found",
				});
			}

			const updatedEnrollment = await updateEnrollmentStatus(
				params.id,
				body.status,
			);

			return { enrollment: updatedEnrollment };
		},
		{
			body: t.Object({
				status: t.Union([
					t.Literal("ACTIVE"),
					t.Literal("COMPLETED"),
					t.Literal("CANCELLED"),
					t.Literal("SUSPENDED"),
				]),
			}),
		},
	)
	.put(
		"/:id/progress",
		async ({ params, body, headers, status }) => {
			const token = headers.authorization?.split(" ")[1];

			if (!token) {
				return status(401, {
					error: "Unauthorized",
				});
			}

			const userId = await verifyToken(token);
			const enrollment = await findEnrollmentById(params.id);

			if (!enrollment) {
				return status(404, {
					error: "Enrollment not found",
				});
			}

			// Users can only update their own enrollment progress
			if (enrollment.userId !== userId) {
				return status(403, {
					error: "Forbidden - You can only update your own enrollment progress",
				});
			}

			const { progressPercentage, currentLessonId } = body;

			const updatedEnrollment = await updateEnrollmentProgress(params.id, {
				progressPercentage,
				currentLessonId,
			});

			return { enrollment: updatedEnrollment };
		},
		{
			body: t.Object({
				progressPercentage: t.Optional(t.Number({ minimum: 0, maximum: 100 })),
				currentLessonId: t.Optional(t.String()),
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
		const user = await findUserById(userId);

		if (!user) {
			return status(404, {
				error: "User not found",
			});
		}

		const enrollment = await findEnrollmentById(params.id);

		if (!enrollment) {
			return status(404, {
				error: "Enrollment not found",
			});
		}

		// Users can only delete their own enrollments unless they're admin
		if (enrollment.userId !== userId && user.role !== "ADMIN") {
			return status(403, {
				error: "Forbidden - You can only delete your own enrollments",
			});
		}

		await deleteEnrollment(params.id);

		return { message: "Enrollment deleted successfully" };
	});
