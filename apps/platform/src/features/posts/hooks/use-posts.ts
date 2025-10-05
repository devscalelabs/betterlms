import { useQuery } from "@tanstack/react-query";
import { api } from "@/utils/api-client";
import type { PostsResponse } from "../types";

export const usePosts = (parentId?: string) => {
	const { data: postsData, isLoading: isLoadingPosts } = useQuery({
		queryKey: ["posts", parentId],
		queryFn: () => {
			const url = parentId
				? `api/v1/posts/?parentId=${parentId}`
				: "api/v1/posts/";
			return api.get<PostsResponse>(url).json();
		},
	});

	return {
		posts: postsData?.posts || [],
		isLoadingPosts,
	};
};
