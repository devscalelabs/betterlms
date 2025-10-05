import { useParams } from "react-router";
import { PostCard } from "@/features/posts/components/post-card";
import { usePost } from "@/features/posts/hooks/use-post";

export const PostDetail = () => {
	const { id } = useParams<{ id: string }>();
	const { post, isLoading } = usePost(id || "");

	if (isLoading) {
		return (
			<div className="flex items-center justify-center p-8">
				<p className="text-muted-foreground">Loading post...</p>
			</div>
		);
	}

	if (!post) {
		return (
			<div className="flex items-center justify-center p-8">
				<p className="text-muted-foreground">Post not found</p>
			</div>
		);
	}

	return (
		<div>
			<PostCard post={post} isDetailView />
		</div>
	);
};
