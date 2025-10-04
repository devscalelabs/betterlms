import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { api } from "@/utils/api-client";
import type { CreatePostRequest, CreatePostResponse } from "../types";

export const useCreatePost = () => {
	const [formData, setFormData] = useState<CreatePostRequest>({
		content: "",
	});

	const queryClient = useQueryClient();

	const { mutate: createPost, isPending: isCreatingPost } = useMutation({
		mutationFn: async (channelId?: string) => {
			const requestData = {
				...formData,
				channelId: channelId || undefined,
			};

			const response = await api
				.post<CreatePostResponse>("api/v1/posts/", {
					json: requestData,
				})
				.json();
			return response;
		},
		onSuccess: () => {
			// Invalidate and refetch posts list
			queryClient.invalidateQueries({ queryKey: ["posts"] });
			// Reset form
			setFormData({ content: "" });
		},
		onError: (error) => {
			console.error("Failed to create post:", error);
		},
	});

	return {
		formData,
		setFormData,
		createPost,
		isCreatingPost,
	};
};
