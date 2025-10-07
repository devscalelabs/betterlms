import { Elysia } from "elysia";
import { findLessonById } from "../services/lessons";

export const lessonsRouter = new Elysia({ prefix: "/lessons" }).get(
	"/:lessonId",
	async ({ params, status }) => {
		const { lessonId } = params;

		const lesson = await findLessonById(lessonId);

		if (!lesson) {
			return status(404, {
				error: "Lesson not found",
			});
		}

		return { lesson };
	},
);
