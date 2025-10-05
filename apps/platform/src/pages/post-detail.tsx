import { getRelativeTime } from "@betterlms/common/date";
import { getUserInitials } from "@betterlms/common/strings";
import {
	Avatar,
	AvatarFallback,
	AvatarImage,
	Button,
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@betterlms/ui";
import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { HeadingBox } from "@/components/shared/heading-box";
import { useAccount } from "@/features/account/hooks/use-account";
import { PostCard } from "@/features/posts/components/post-card";
import { PostForm } from "@/features/posts/components/post-form";
import { PostMedia } from "@/features/posts/components/post-media";
import { useDeletePost } from "@/features/posts/hooks/use-delete-post";
import { usePost } from "@/features/posts/hooks/use-post";
import { usePosts } from "@/features/posts/hooks/use-posts";

export const PostDetail = () => {
	const navigate = useNavigate();
	const { id } = useParams<{ id: string }>();
	const { post, isLoading } = usePost(id || "");
	const { posts: replies, isLoadingPosts: isLoadingReplies } = usePosts(id);
	const { account } = useAccount();
	const { deletePost, isDeletingPost } = useDeletePost();
	const [isReplyFormOpen, setIsReplyFormOpen] = useState(false);

	const isCurrentUser = account?.user?.id === post?.user?.id;

	const handleDelete = () => {
		if (post) {
			deletePost(post.id);
		}
	};

	const handleReport = () => {
		console.log("Report post:", post?.id);
	};

	const handleToggleReplyForm = () => {
		setIsReplyFormOpen(!isReplyFormOpen);
	};

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
			<HeadingBox>
				<Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
					Back
				</Button>
				<div>Newest</div>
			</HeadingBox>
			{/* Post Detail */}
			<article className="border-b border-border p-4">
				{/* Header */}
				<div className="flex gap-3 items-start mb-4">
					{/* Avatar */}
					<Avatar className="size-10">
						<AvatarImage
							src={post.user?.imageUrl || ""}
							alt={post.user?.name || ""}
						/>
						<AvatarFallback>
							{post.user ? getUserInitials(post.user.name) : "?"}
						</AvatarFallback>
					</Avatar>
					<div className="flex-1">
						<div className="font-semibold text-sm">
							{post.user?.name || "Unknown"}
						</div>
						<div className="text-muted-foreground text-sm">
							@{post.user?.username || "unknown"}
						</div>
					</div>
					{/* Dropdown Menu */}
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button
								variant="ghost"
								size="sm"
								className="text-muted-foreground hover:text-foreground h-6 w-6 p-0"
							>
								<span className="text-xs">⋯</span>
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							{isCurrentUser && (
								<DropdownMenuItem
									onClick={handleDelete}
									className="text-red-600"
									disabled={isDeletingPost}
								>
									{isDeletingPost ? "Deleting..." : "Delete"}
								</DropdownMenuItem>
							)}
							<DropdownMenuItem onClick={handleReport}>Report</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>

				{/* Channel */}
				{post.channel && (
					<div className="mb-3">
						<span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
							#{post.channel.name}
						</span>
					</div>
				)}

				{/* Content */}
				<div className="text-sm leading-relaxed mb-3 whitespace-pre-line">
					{post.content}
				</div>

				{/* Media */}
				{post.Media && <PostMedia media={post.Media} />}

				{/* Actions */}
				<div className="flex items-center">
					<Button
						variant="ghost"
						size="sm"
						className="text-muted-foreground hover:text-primary"
						onClick={handleToggleReplyForm}
					>
						<span className="text-xs">Reply</span>
					</Button>
					<Button
						variant="ghost"
						size="sm"
						className="text-muted-foreground hover:text-red-500"
					>
						<span className="text-xs">Like</span>
						{post.likeCount > 0 && (
							<span className="ml-1">{post.likeCount}</span>
						)}
					</Button>
					<div className="text-muted-foreground text-xs ml-2">
						{getRelativeTime(post.createdAt)}
					</div>
				</div>
			</article>

			{/* Reply Form */}
			{isReplyFormOpen && (
				<PostForm
					parentId={post.id}
					onSuccess={() => setIsReplyFormOpen(false)}
				/>
			)}

			{/* Replies Section */}
			<div className="mt-4">
				{isLoadingReplies ? (
					<div className="flex items-center justify-center p-8">
						<p className="text-muted-foreground">Loading replies...</p>
					</div>
				) : replies.length > 0 ? (
					<div className="divide-y divide-border">
						{replies.map((reply) => (
							<PostCard key={reply.id} post={reply} />
						))}
					</div>
				) : (
					<div className="flex items-center justify-center p-8">
						<p className="text-muted-foreground">No replies yet</p>
					</div>
				)}
			</div>
		</div>
	);
};
