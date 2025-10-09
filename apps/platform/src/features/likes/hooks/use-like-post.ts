import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/utils/api-client";
import type { LikePostResponse } from "../types";

export const useLikePost = () => {
	const queryClient = useQueryClient();

	const { mutate: likePost, isPending: isLikingPost } = useMutation({
		mutationFn: async (postId: string) => {
			const response = await api
				.post<LikePostResponse>(`api/v1/posts/${postId}/like/`)
				.json();
			return response;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["posts"] });
		},
		onError: (error) => {
			console.error("Failed to like post:", error);
		},
	});

	return {
		likePost,
		isLikingPost,
	};
};
