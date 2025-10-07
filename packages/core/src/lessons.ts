import { prisma } from "@betterlms/database";

export async function findLessonById(lessonId: string) {
	const lesson = await prisma.lesson.findUnique({
		where: {
			id: lessonId,
		},
	});

	return lesson;
}

export async function updateLesson(
	lessonId: string,
	data: {
		title?: string;
		content?: string;
		videoUrl?: string;
		isFree?: boolean;
	},
) {
	const lesson = await prisma.lesson.update({
		where: {
			id: lessonId,
		},
		data,
	});

	return lesson;
}
