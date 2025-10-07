import { useQuery } from "@tanstack/react-query";
import { api } from "@/utils/api-client";
import type { EnrollmentsResponse } from "../types";

export const useMyEnrollments = () => {
	const {
		data: enrollmentsData,
		isLoading,
		error,
	} = useQuery({
		queryKey: ["enrollments", "my-enrollments"],
		queryFn: () =>
			api.get<EnrollmentsResponse>("api/v1/enrollments/my-enrollments").json(),
		enabled: !!localStorage.getItem("token"),
	});

	return {
		enrollments: enrollmentsData?.enrollments || [],
		isLoading,
		error,
	};
};
