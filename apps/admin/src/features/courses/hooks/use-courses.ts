import { useQuery } from "@tanstack/react-query";
import { api } from "@/utils/api-client";
import type { CoursesResponse } from "../types";

export const useCourses = () => {
	const { data: coursesData, isLoading: isCoursesLoading } = useQuery({
		queryKey: ["courses"],
		queryFn: () => api.get<CoursesResponse>("api/v1/courses/").json(),
	});

	return {
		courses: coursesData?.courses || [],
		isCoursesLoading,
	};
};
