import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { api } from "@/utils/api-client";
import type { CreateSectionRequest, CreateSectionResponse } from "../types";

type UseCreateSectionOptions = {
	courseId: string;
	onSuccess?: () => void;
};

export const useCreateSection = ({
	courseId,
	onSuccess,
}: UseCreateSectionOptions) => {
	const [formData, setFormData] = useState<CreateSectionRequest>({
		title: "",
		order: 0,
	});

	const queryClient = useQueryClient();

	const { mutate: createSection, isPending: isCreatingSection } = useMutation({
		mutationFn: async () => {
			const response = await api
				.post<CreateSectionResponse>(`api/v1/courses/${courseId}/sections/`, {
					json: formData,
				})
				.json();
			return response;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["course", courseId] });
			setFormData({ title: "", order: 0 });
			onSuccess?.();
		},
		onError: (error) => {
			console.error("Failed to create section:", error);
		},
	});

	const handleTitleChange = (title: string) => {
		setFormData({ ...formData, title });
	};

	const handleOrderChange = (order: number) => {
		setFormData({ ...formData, order });
	};

	const isFormValid = formData.title.trim().length > 0;

	return {
		formData,
		handleTitleChange,
		handleOrderChange,
		createSection,
		isCreatingSection,
		isFormValid,
	};
};
