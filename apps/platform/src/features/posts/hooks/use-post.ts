import { useQuery } from "@tanstack/react-query";
import { api } from "@/utils/api-client";
import type { Post } from "../types";

interface PostResponse {
	post: Post;
}

export const usePost = (postId: string) => {
	const { data, isLoading, error } = useQuery({
		queryKey: ["post", postId],
		queryFn: () => api.get<PostResponse>(`api/v1/posts/${postId}/`).json(),
	});

	return { post: data?.post, isLoading, error };
};
