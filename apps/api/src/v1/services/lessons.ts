import { prisma } from "@betterlms/database";

export async function findLessonById(lessonId: string) {
	const lesson = await prisma.lesson.findUnique({
		where: {
			id: lessonId,
		},
	});

	return lesson;
}
