import { useQuery } from "@tanstack/react-query";
import { api } from "@/utils/api-client";
import type { PostsResponse } from "../types";

export const usePosts = () => {
	const { data: postsData, isLoading: isLoadingPosts } = useQuery({
		queryKey: ["posts"],
		queryFn: () => api.get<PostsResponse>("api/v1/posts/").json(),
	});

	return {
		posts: postsData?.posts || [],
		isLoadingPosts,
	};
};
