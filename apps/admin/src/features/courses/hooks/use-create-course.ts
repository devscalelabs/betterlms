import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { api } from "@/utils/api-client";
import type { CreateCourseRequest, CreateCourseResponse } from "../types";

type UseCreateCourseOptions = {
	onSuccess?: () => void;
};

export const useCreateCourse = ({ onSuccess }: UseCreateCourseOptions = {}) => {
	const [formData, setFormData] = useState<CreateCourseRequest>({
		title: "",
		description: "",
		slug: "",
		thumbnailUrl: "",
		isPublished: false,
		isPrivate: false,
		price: 0,
		currency: "USD",
		tags: [],
		category: "",
	});

	const queryClient = useQueryClient();

	const { mutate: createCourse, isPending: isCreatingCourse } = useMutation({
		mutationFn: async () => {
			const response = await api
				.post<CreateCourseResponse>("api/v1/courses/", {
					json: formData,
				})
				.json();
			return response;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["courses"] });
			setFormData({
				title: "",
				description: "",
				slug: "",
				thumbnailUrl: "",
				isPublished: false,
				isPrivate: false,
				price: 0,
				currency: "USD",
				tags: [],
				category: "",
			});
			onSuccess?.();
		},
		onError: (error) => {
			console.error("Failed to create course:", error);
		},
	});

	const generateSlug = (title: string) => {
		return title
			.toLowerCase()
			.replace(/[^a-z0-9\s-]/g, "")
			.replace(/\s+/g, "-")
			.replace(/-+/g, "-")
			.trim();
	};

	const handleTitleChange = (newTitle: string) => {
		setFormData({ ...formData, title: newTitle });
	};

	const handleDescriptionChange = (newDescription: string) => {
		setFormData({ ...formData, description: newDescription });
	};

	const handleSlugChange = (newSlug: string) => {
		setFormData({ ...formData, slug: newSlug });
	};

	const handleThumbnailUrlChange = (newThumbnailUrl: string) => {
		setFormData({ ...formData, thumbnailUrl: newThumbnailUrl });
	};

	const handleIsPublishedChange = (isPublished: boolean) => {
		setFormData({ ...formData, isPublished });
	};

	const handleIsPrivateChange = (isPrivate: boolean) => {
		setFormData({ ...formData, isPrivate });
	};

	const handlePriceChange = (price: number) => {
		setFormData({ ...formData, price });
	};

	const handleCurrencyChange = (currency: string) => {
		setFormData({ ...formData, currency });
	};

	const handleTagsChange = (tags: string[]) => {
		setFormData({ ...formData, tags });
	};

	const handleCategoryChange = (category: string) => {
		setFormData({ ...formData, category });
	};

	const isFormValid =
		formData.title.trim().length > 0 && formData.slug.trim().length > 0;

	return {
		formData,
		handleTitleChange,
		handleDescriptionChange,
		handleSlugChange,
		handleThumbnailUrlChange,
		handleIsPublishedChange,
		handleIsPrivateChange,
		handlePriceChange,
		handleCurrencyChange,
		handleTagsChange,
		handleCategoryChange,
		createCourse,
		isCreatingCourse,
		isFormValid,
		generateSlug,
	};
};
