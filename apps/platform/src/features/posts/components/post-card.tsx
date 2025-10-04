import { Avatar, AvatarFallback, AvatarImage, Button } from "@betterlms/ui";
import type { Post } from "../types";

interface PostCardProps {
	post: Post;
}

export const PostCard = ({ post }: PostCardProps) => {
	const formatDate = (dateString: string) => {
		const date = new Date(dateString);
		const now = new Date();
		const diffInHours = Math.floor(
			(now.getTime() - date.getTime()) / (1000 * 60 * 60),
		);

		if (diffInHours < 1) {
			return "now";
		} else if (diffInHours < 24) {
			return `${diffInHours}h`;
		} else {
			const diffInDays = Math.floor(diffInHours / 24);
			return `${diffInDays}d`;
		}
	};

	const getUserInitials = (name: string) => {
		return name
			.split(" ")
			.map((n) => n[0])
			.join("")
			.toUpperCase()
			.slice(0, 2);
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
					<div className="flex items-center gap-2 mb-1">
						<span className="font-semibold text-sm">
							{post.user?.name || "Unknown"}
						</span>
						<span className="text-muted-foreground text-sm">
							@{post.user?.username || "unknown"}
						</span>
						<span className="text-muted-foreground text-sm">·</span>
						<span className="text-muted-foreground text-sm">
							{formatDate(post.createdAt)}
						</span>
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
					<div className="text-sm leading-relaxed mb-3">{post.content}</div>

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
						<Button
							variant="ghost"
							size="sm"
							className="text-muted-foreground hover:text-blue-500"
						>
							<span className="text-xs">Share</span>
						</Button>
					</div>
				</div>
			</div>
		</article>
	);
};
