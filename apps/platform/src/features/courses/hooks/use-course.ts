import { useQuery } from "@tanstack/react-query";
import { api } from "@/utils/api-client";
import type { CourseResponse } from "../types";

export const useCourse = (courseId: string) => {
	const {
		data: courseData,
		isLoading: isLoadingCourse,
		error,
	} = useQuery({
		queryKey: ["course", courseId],
		queryFn: () =>
			api.get<CourseResponse>(`api/v1/courses/${courseId}/`).json(),
		enabled: !!courseId,
	});

	return {
		course: courseData?.course,
		isLoadingCourse,
		error,
	};
};
