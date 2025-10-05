import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/utils/api-client";
import type { UnlikePostResponse } from "../types";

export const useUnlikePost = () => {
	const queryClient = useQueryClient();

	const { mutate: unlikePost, isPending: isUnlikingPost } = useMutation({
		mutationFn: async (postId: string) => {
			const response = await api
				.delete<UnlikePostResponse>(`api/v1/posts/${postId}/like`)
				.json();
			return response;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["posts"] });
		},
		onError: (error) => {
			console.error("Failed to unlike post:", error);
		},
	});

	return {
		unlikePost,
		isUnlikingPost,
	};
};
