import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { api } from "@/utils/api-client";
import type { CreatePostRequest, CreatePostResponse } from "../types";

export const useCreatePost = () => {
	const [formData, setFormData] = useState<CreatePostRequest>({
		content: "",
		images: [],
	});

	const queryClient = useQueryClient();

	const { mutate: createPost, isPending: isCreatingPost } = useMutation({
		mutationFn: async ({ channelId }: { channelId?: string } = {}) => {
			const formDataToSend = new FormData();

			// Add text content
			formDataToSend.append("content", formData.content);
			if (formData.title) {
				formDataToSend.append("title", formData.title);
			}
			if (channelId) {
				formDataToSend.append("channelId", channelId);
			}

			// Add images
			if (formData.images && formData.images.length > 0) {
				formData.images.forEach((image) => {
					formDataToSend.append("images", image);
				});
			}

			const response = await api
				.post<CreatePostResponse>("api/v1/posts/", {
					body: formDataToSend,
				})
				.json();
			return response;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["posts"] });
			setFormData({ content: "", images: [] });
		},
		onError: (error) => {
			console.error("Failed to create post:", error);
		},
	});

	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const files = Array.from(event.target.files || []);

		// Filter for PNG and JPEG only
		const validFiles = files.filter(
			(file) => file.type === "image/png" || file.type === "image/jpeg",
		);

		// Limit to maximum 10 images
		const newImages = [...(formData.images || []), ...validFiles].slice(0, 10);
		setFormData({ ...formData, images: newImages });
	};

	const removeImage = (index: number) => {
		setFormData({
			...formData,
			images: formData.images?.filter((_, i) => i !== index) || [],
		});
	};

	return {
		formData,
		setFormData,
		selectedImages: formData.images || [],
		handleFileChange,
		removeImage,
		createPost,
		isCreatingPost,
	};
};
