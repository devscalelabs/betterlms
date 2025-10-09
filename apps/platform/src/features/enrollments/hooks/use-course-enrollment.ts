import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSetAtom } from "jotai";
import { loginDialogAtom } from "@/features/auth/atoms/login-dialog-atom";
import { api } from "@/utils/api-client";
import type {
	CreateEnrollmentRequest,
	EnrollmentResponse,
	EnrollmentsResponse,
	UpdateEnrollmentProgressRequest,
} from "../types";

export const useCourseEnrollment = (courseId: string) => {
	const queryClient = useQueryClient();
	const setLoginDialogOpen = useSetAtom(loginDialogAtom);

	// Check if user is enrolled in the course
	const {
		data: enrollmentData,
		isLoading: isLoadingEnrollment,
		error: enrollmentError,
	} = useQuery({
		queryKey: ["enrollment", "course", courseId],
		queryFn: async () => {
			const enrollments = await api
				.get<EnrollmentsResponse>("api/v1/enrollments/my-enrollments/")
				.json();

			return (
				enrollments.enrollments.find(
					(enrollment) => enrollment.courseId === courseId,
				) || null
			);
		},
		enabled: !!courseId && !!localStorage.getItem("token"),
	});

	// Enroll in course mutation
	const { mutate: enrollInCourse, isPending: isEnrolling } = useMutation({
		mutationFn: async (data: CreateEnrollmentRequest) => {
			const response = await api
				.post<EnrollmentResponse>("api/v1/enrollments/", {
					json: data,
				})
				.json();
			return response;
		},
		onSuccess: () => {
			// Invalidate and refetch enrollment data
			queryClient.invalidateQueries({
				queryKey: ["enrollment", "course", courseId],
			});
			queryClient.invalidateQueries({
				queryKey: ["enrollments", "my-enrollments"],
			});
		},
		onError: (error) => {
			console.error("Failed to enroll in course:", error);
		},
	});

	// Update enrollment progress mutation
	const { mutate: updateProgress, isPending: isUpdatingProgress } = useMutation(
		{
			mutationFn: async ({
				enrollmentId,
				data,
			}: {
				enrollmentId: string;
				data: UpdateEnrollmentProgressRequest;
			}) => {
				const response = await api
					.put<EnrollmentResponse>(
						`api/v1/enrollments/${enrollmentId}/progress/`,
						{
							json: data,
						},
					)
					.json();
				return response;
			},
			onSuccess: () => {
				// Invalidate and refetch enrollment data
				queryClient.invalidateQueries({
					queryKey: ["enrollment", "course", courseId],
				});
			},
			onError: (error) => {
				console.error("Failed to update enrollment progress:", error);
			},
		},
	);

	// Cancel enrollment mutation
	const { mutate: cancelEnrollment, isPending: isCancelling } = useMutation({
		mutationFn: async (enrollmentId: string) => {
			await api.delete(`api/v1/enrollments/${enrollmentId}/`);
		},
		onSuccess: () => {
			// Invalidate and refetch enrollment data
			queryClient.invalidateQueries({
				queryKey: ["enrollment", "course", courseId],
			});
			queryClient.invalidateQueries({
				queryKey: ["enrollments", "my-enrollments"],
			});
		},
		onError: (error) => {
			console.error("Failed to cancel enrollment:", error);
		},
	});

	return {
		// Data
		enrollment: enrollmentData,
		isEnrolled: !!enrollmentData,
		isLoadingEnrollment,
		enrollmentError,

		// Actions
		enrollInCourse,
		isEnrolling,
		updateProgress,
		isUpdatingProgress,
		cancelEnrollment,
		isCancelling,

		// Helper functions
		enroll: (data?: Omit<CreateEnrollmentRequest, "courseId">) => {
			// Check if user is logged in
			const token = localStorage.getItem("token");
			if (!token) {
				setLoginDialogOpen(true);
				return;
			}

			enrollInCourse({
				courseId,
				...data,
			});
		},
		updateEnrollmentProgress: (data: UpdateEnrollmentProgressRequest) => {
			if (enrollmentData) {
				updateProgress({
					enrollmentId: enrollmentData.id,
					data,
				});
			}
		},
		cancel: () => {
			// Check if user is logged in
			const token = localStorage.getItem("token");
			if (!token) {
				setLoginDialogOpen(true);
				return;
			}

			if (enrollmentData) {
				cancelEnrollment(enrollmentData.id);
			}
		},
	};
};
