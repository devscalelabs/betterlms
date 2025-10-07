import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { HTTPError } from "ky";
import { useEffect, useState } from "react";
import { api } from "../../../utils/api-client";
import type { EditLessonRequest, EditLessonResponse, Lesson } from "../types";

type UseEditLessonOptions = {
	lessonId: string;
	onSuccess?: () => void;
};

export const useEditLesson = ({
	lessonId,
	onSuccess,
}: UseEditLessonOptions) => {
	const [formData, setFormData] = useState<EditLessonRequest>({
		title: "",
		content: "",
		videoUrl: "",
		isFree: false,
	});

	const queryClient = useQueryClient();

	// Fetch the lesson to edit
	const {
		data: lesson,
		isLoading: isLoadingLesson,
		error,
	} = useQuery({
		queryKey: ["lesson", lessonId],
		queryFn: async () => {
			const response = await api
				.get<{ lesson: Lesson }>(`api/v1/lessons/${lessonId}`)
				.json();
			return response.lesson;
		},
		enabled: !!lessonId,
	});

	// Initialize form data when lesson is loaded
	useEffect(() => {
		if (lesson) {
			setFormData({
				title: lesson.title || "",
				content: lesson.content || "",
				videoUrl: lesson.videoUrl || "",
				isFree: lesson.isFree || false,
			});
		}
	}, [lesson]);

	const {
		mutate: updateLesson,
		isPending: isUpdatingLesson,
		error: updateError,
	} = useMutation({
		mutationFn: async () => {
			const updateData = {
				title: formData.title,
				content: formData.content,
				videoUrl: formData.videoUrl,
				isFree: formData.isFree,
			};

			const response = await api
				.put<EditLessonResponse>(`api/v1/lessons/${lessonId}`, {
					json: updateData,
				})
				.json();
			return response;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["lesson", lessonId] });
			// Invalidate course queries to refresh lesson lists
			queryClient.invalidateQueries({ queryKey: ["courses"] });
			onSuccess?.();
		},
		onError: (error) => {
			if (error instanceof HTTPError) {
				console.error("Failed to update lesson:", error);
			}
		},
	});

	const handleTitleChange = (newTitle: string) => {
		setFormData({ ...formData, title: newTitle });
	};

	const handleContentChange = (newContent: string) => {
		setFormData({ ...formData, content: newContent });
	};

	const handleVideoUrlChange = (newVideoUrl: string) => {
		setFormData({ ...formData, videoUrl: newVideoUrl });
	};

	const handleIsFreeChange = (newIsFree: boolean) => {
		setFormData({ ...formData, isFree: newIsFree });
	};

	const isFormValid = (formData.title || "").trim().length > 0;

	return {
		lesson,
		isLoadingLesson,
		error,
		formData,
		handleTitleChange,
		handleContentChange,
		handleVideoUrlChange,
		handleIsFreeChange,
		updateLesson,
		isUpdatingLesson,
		updateError,
		isFormValid,
	};
};
