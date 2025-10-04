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
import { useAccount } from "@/features/account/hooks/use-account";
import { useDeletePost } from "../hooks/use-delete-post";
import type { Post } from "../types";

interface PostCardProps {
	post: Post;
}

export const PostCard = ({ post }: PostCardProps) => {
	const { account } = useAccount();
	const { deletePost, isDeletingPost } = useDeletePost();
	const isCurrentUser = account?.user?.id === post.user?.id;

	const handleDelete = () => {
		deletePost(post.id);
	};

	const handleReport = () => {
		console.log("Report post:", post.id);
	};

	return (
		<article className="border-b border-border p-4 hover:bg-muted/50 transition-colors">
			<div className="flex gap-3">
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

				{/* Content */}
				<div className="flex-1 min-w-0">
					{/* Header */}
					<div className="flex items-center justify-between mb-1">
						<div className="flex items-center gap-2">
							<span className="font-semibold text-sm">
								{post.user?.name || "Unknown"}
							</span>
							<span className="text-muted-foreground text-sm">
								@{post.user?.username || "unknown"}
							</span>
							<span className="text-muted-foreground text-sm">·</span>
							<span className="text-muted-foreground text-sm">
								{getRelativeTime(post.createdAt)}
							</span>
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
								<DropdownMenuItem onClick={handleReport}>
									Report
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</div>

					{/* Channel */}
					{post.channel && (
						<div className="mb-2">
							<span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
								#{post.channel.name}
							</span>
						</div>
					)}

					{/* Content */}
					<div className="text-sm leading-relaxed mb-3 whitespace-pre-line">
						{post.content}
					</div>

					{/* Actions */}
					<div className="flex items-center">
						<Button
							variant="ghost"
							size="sm"
							className="text-muted-foreground hover:text-primary"
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
					</div>
				</div>
			</div>
		</article>
	);
};
