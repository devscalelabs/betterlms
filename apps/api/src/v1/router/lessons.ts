import {
	findLessonById,
	findUserById,
	updateLesson,
	verifyToken,
} from "@betterlms/core";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";

const lessonsRouter = new Hono();

lessonsRouter.get("/lessons/:lessonId", async (c) => {
	const lessonId = c.req.param("lessonId");

	const lesson = await findLessonById(lessonId);

	if (!lesson) {
		return c.json(
			{
				error: "Lesson not found",
			},
			404,
		);
	}

	return c.json({ lesson });
});

lessonsRouter.put(
	"/lessons/:lessonId",
	zValidator(
		"json",
		z.object({
			title: z.string().min(1).max(200).optional(),
			content: z.string().optional(),
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

		// Only admin users can update lessons
		if (user.role !== "ADMIN") {
			return c.json(
				{
					error: "Forbidden - Only admin users can update lessons",
				},
				403,
			);
		}

		const body = c.req.valid("json");
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

		const lesson = await updateLesson(c.req.param("lessonId"), updateData);

		return c.json({ lesson });
	},
);

export { lessonsRouter };
