import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/utils/api-client";
import type { DeletePostResponse } from "../types";

export const useDeletePost = () => {
	const queryClient = useQueryClient();

	const { mutate: deletePost, isPending: isDeletingPost } = useMutation({
		mutationFn: async (postId: string) => {
			const response = await api
				.delete<DeletePostResponse>(`api/v1/posts/${postId}/`)
				.json();
			return response;
		},
		onSuccess: () => {
			// Invalidate and refetch posts list
			queryClient.invalidateQueries({ queryKey: ["posts"] });
		},
		onError: (error) => {
			console.error("Failed to delete post:", error);
		},
	});

	return {
		deletePost,
		isDeletingPost,
	};
};
