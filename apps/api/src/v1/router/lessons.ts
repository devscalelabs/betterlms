import { Elysia, t } from "elysia";
import { verifyToken } from "../services/jwt";
import { findLessonById, updateLesson } from "../services/lessons";
import { findUserById } from "../services/users";

export const lessonsRouter = new Elysia({ prefix: "/lessons" })
	.get("/:lessonId", async ({ params, status }) => {
		const { lessonId } = params;

		const lesson = await findLessonById(lessonId);

		if (!lesson) {
			return status(404, {
				error: "Lesson not found",
			});
		}

		return { lesson };
	})
	.put(
		"/:lessonId",
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

			// Only admin users can update lessons
			if (user.role !== "ADMIN") {
				return status(403, {
					error: "Forbidden - Only admin users can update lessons",
				});
			}

			const { title, content, videoUrl, isFree } = body;

			const updateData: {
				title?: string;
				content?: string;
				videoUrl?: string;
				isFree?: boolean;
			} = {};

			if (title !== undefined) updateData.title = title;
			if (content !== undefined) updateData.content = content;
			if (videoUrl !== undefined) updateData.videoUrl = videoUrl;
			if (isFree !== undefined) updateData.isFree = isFree;

			const lesson = await updateLesson(params.lessonId, updateData);

			return { lesson };
		},
		{
			body: t.Object({
				title: t.Optional(t.String({ minLength: 1, maxLength: 200 })),
				content: t.Optional(t.String()),
				videoUrl: t.Optional(t.String()),
				isFree: t.Optional(t.Boolean()),
			}),
		},
	);
