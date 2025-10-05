import { useQuery } from "@tanstack/react-query";
import { api } from "@/utils/api-client";
import type { PostsResponse } from "../types";

interface UsePostsFilters {
	parentId?: string;
	username?: string;
	channelSlug?: string;
}

export const usePosts = (filters?: UsePostsFilters) => {
	const { data: postsData, isLoading: isLoadingPosts } = useQuery({
		queryKey: ["posts", filters],
		queryFn: () => {
			const params = new URLSearchParams();
			if (filters?.parentId) params.append("parentId", filters.parentId);
			if (filters?.username) params.append("username", filters.username);
			if (filters?.channelSlug)
				params.append("channelSlug", filters.channelSlug);

			const url = params.toString()
				? `api/v1/posts/?${params.toString()}`
				: "api/v1/posts/";

			return api.get<PostsResponse>(url).json();
		},
	});

	return {
		posts: postsData?.posts || [],
		isLoadingPosts,
	};
};
