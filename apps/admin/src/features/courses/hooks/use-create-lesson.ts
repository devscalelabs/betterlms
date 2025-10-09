import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { api } from "@/utils/api-client";
import type { CreateLessonRequest, CreateLessonResponse } from "../types";

type UseCreateLessonOptions = {
	courseId: string;
	sectionId: string;
	onSuccess?: () => void;
};

export const useCreateLesson = ({
	courseId,
	sectionId,
	onSuccess,
}: UseCreateLessonOptions) => {
	const [formData, setFormData] = useState<CreateLessonRequest>({
		title: "",
		content: "",
		order: 0,
		type: "TEXT",
		videoUrl: "",
		isFree: false,
	});

	const queryClient = useQueryClient();

	const { mutate: createLesson, isPending: isCreatingLesson } = useMutation({
		mutationFn: async () => {
			const response = await api
				.post<CreateLessonResponse>(
					`api/v1/courses/${courseId}/sections/${sectionId}/lessons/`,
					{
						json: formData,
					},
				)
				.json();
			return response;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["course", courseId] });
			setFormData({
				title: "",
				content: "",
				order: 0,
				type: "TEXT",
				videoUrl: "",
				isFree: false,
			});
			onSuccess?.();
		},
		onError: (error) => {
			console.error("Failed to create lesson:", error);
		},
	});

	const handleTitleChange = (title: string) => {
		setFormData({ ...formData, title });
	};

	const handleContentChange = (content: string) => {
		setFormData({ ...formData, content });
	};

	const handleOrderChange = (order: number) => {
		setFormData({ ...formData, order });
	};

	const handleTypeChange = (type: "VIDEO" | "TEXT") => {
		setFormData({ ...formData, type });
	};

	const handleVideoUrlChange = (videoUrl: string) => {
		setFormData({ ...formData, videoUrl });
	};

	const handleIsFreeChange = (isFree: boolean) => {
		setFormData({ ...formData, isFree });
	};

	const isFormValid = formData.title.trim().length > 0;

	return {
		formData,
		handleTitleChange,
		handleContentChange,
		handleOrderChange,
		handleTypeChange,
		handleVideoUrlChange,
		handleIsFreeChange,
		createLesson,
		isCreatingLesson,
		isFormValid,
	};
};
