import { useQuery } from "@tanstack/react-query";
import { api } from "@/utils/api-client";
import type { CoursesResponse } from "../types";

interface UseCoursesFilters {
  instructorId?: string;
  category?: string;
  isPublished?: boolean;
}

export const useCourses = (filters?: UseCoursesFilters) => {
  const { data: coursesData, isLoading: isLoadingCourses } = useQuery({
    queryKey: ["courses", filters],
    queryFn: () => {
      const params = new URLSearchParams();
      if (filters?.instructorId)
        params.append("instructorId", filters.instructorId);
      if (filters?.category) params.append("category", filters.category);
      if (filters?.isPublished !== undefined) {
        params.append("isPublished", filters.isPublished.toString());
      }

      const url = params.toString()
        ? `courses/?${params.toString()}`
        : "courses/";

      return api.get<CoursesResponse>(url).json();
    },
  });

  return {
    courses: coursesData?.courses || [],
    isLoadingCourses,
  };
};
