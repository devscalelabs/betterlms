import { usePosts } from "../hooks/use-posts";
import { usePostsFilter } from "../hooks/use-posts-filter";
import { PostCard } from "./post-card";

export const PostsList = () => {
	const filters = usePostsFilter();
	const { posts, isLoadingPosts } = usePosts(filters);

	if (isLoadingPosts) {
		return (
			<div className="flex items-center justify-center py-8">
				<div className="text-muted-foreground">Loading posts...</div>
			</div>
		);
	}

	if (posts.length === 0) {
		return (
			<div className="flex flex-col items-center justify-center py-8 text-center">
				<div className="text-muted-foreground mb-2">No posts yet</div>
				<div className="text-sm text-muted-foreground">
					Be the first to share something!
				</div>
			</div>
		);
	}

	return (
		<div className="divide-y divide-border">
			{posts.map((post) => (
				<PostCard key={post.id} post={post} />
			))}
		</div>
	);
};
