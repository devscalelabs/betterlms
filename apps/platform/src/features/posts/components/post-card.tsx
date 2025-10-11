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
import { useSetAtom } from "jotai";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useAccount } from "@/features/account/hooks/use-account";
import { loginDialogAtom } from "@/features/auth/atoms/login-dialog-atom";
import { useLikePost } from "@/features/likes/hooks/use-like-post";
import { useUnlikePost } from "@/features/likes/hooks/use-unlike-post";
import { useDeletePost } from "../hooks/use-delete-post";
import type { Post } from "../types";
import { parseContent } from "../utils/parse-content";
import { CommentPreview } from "./comment-preview";
import { PostForm } from "./post-form";
import { PostMedia } from "./post-media";

interface PostCardProps {
	post: Post;
	isDetailView?: boolean;
}

export const PostCard = ({ post, isDetailView = false }: PostCardProps) => {
	const navigate = useNavigate();
	const { account } = useAccount();
	const { deletePost, isDeletingPost } = useDeletePost();
	const { likePost, isLikingPost } = useLikePost();
	const { unlikePost, isUnlikingPost } = useUnlikePost();
	const setLoginDialog = useSetAtom(loginDialogAtom);
	const isCurrentUser = account?.user?.id === post.user?.id;

	const [isLiked, setIsLiked] = useState(post.isLiked);
	const [optimisticLikeCount, setOptimisticLikeCount] = useState(
		post.likeCount,
	);
	const [showReplyForm, setShowReplyForm] = useState(false);

	// Sync isLiked state when post prop changes
	useEffect(() => {
		setIsLiked(post.isLiked);
	}, [post.isLiked]);

	// Sync optimisticLikeCount when post.likeCount changes
	useEffect(() => {
		setOptimisticLikeCount(post.likeCount);
	}, [post.likeCount]);

	const handleDelete = (e: React.MouseEvent) => {
		e.stopPropagation();
		deletePost(post.id);
	};

	const handleReport = (e: React.MouseEvent) => {
		e.stopPropagation();
		console.log("Report post:", post.id);
	};

	const handleReply = (e: React.MouseEvent) => {
		e.stopPropagation();

		if (!account) {
			setLoginDialog(true);
			return;
		}

		setShowReplyForm((prev) => !prev);
	};

	const handleLike = (e: React.MouseEvent) => {
		e.stopPropagation();

		if (!account) {
			setLoginDialog(true);
			return;
		}

		if (isLiked) {
			setIsLiked(false);
			setOptimisticLikeCount((prev) => prev - 1);
			unlikePost(post.id);
		} else {
			setIsLiked(true);
			setOptimisticLikeCount((prev) => prev + 1);
			likePost(post.id);
		}
	};

	const handleReplySuccess = () => {
		setShowReplyForm(false);
	};

	const handleCardClick = (e: React.MouseEvent) => {
		// Don't navigate if clicking on dialog overlay or dialog-related elements
		const target = e.target as HTMLElement;
		if (
			target.hasAttribute("data-radix-portal") ||
			target.closest("[data-radix-portal]") ||
			target.hasAttribute("data-state")
		) {
			return;
		}

		if (!isDetailView) {
			navigate(`/post/${post.id}`);
		}
	};

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (!isDetailView && (e.key === "Enter" || e.key === " ")) {
			e.preventDefault();
			navigate(`/post/${post.id}`);
		}
	};

	const handleUsernameClick = (e: React.MouseEvent) => {
		e.stopPropagation();
		if (post.user?.username) {
			navigate(`/profile/${post.user.username}`);
		}
	};

	return (
		<article
			className={`border-b border-border p-4 transition-colors ${!isDetailView ? "hover:bg-muted/50 cursor-pointer" : ""}`}
			onClick={handleCardClick}
			onKeyDown={handleKeyDown}
			role={!isDetailView ? "button" : undefined}
			tabIndex={!isDetailView ? 0 : undefined}
		>
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
							<button
								type="button"
								onClick={handleUsernameClick}
								className="font-semibold text-sm hover:underline"
							>
								{post.user?.name || "Unknown"}
							</button>
							<button
								type="button"
								onClick={handleUsernameClick}
								className="text-muted-foreground text-sm hover:underline"
							>
								@{post.user?.username || "unknown"}
							</button>
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
									onClick={(e) => e.stopPropagation()}
								>
									<span className="text-xs">⋯</span>
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end">
								{isCurrentUser && (
									<DropdownMenuItem
										onClick={(e) => handleDelete(e)}
										className="text-red-600"
										disabled={isDeletingPost}
									>
										{isDeletingPost ? "Deleting..." : "Delete"}
									</DropdownMenuItem>
								)}
								<DropdownMenuItem onClick={(e) => handleReport(e)}>
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
						{parseContent(post.content)}
					</div>

					{/* Media */}
					{post.Media && <PostMedia media={post.Media} />}

					{/* Actions */}
					<div className="flex items-center">
						<Button
							variant="ghost"
							size="sm"
							className={`${
								showReplyForm
									? "text-primary"
									: "text-muted-foreground hover:text-primary"
							}`}
							onClick={handleReply}
						>
							<span className="text-xs">Reply</span>
						</Button>
						<Button
							variant="ghost"
							size="sm"
							className={`${
								isLiked && account
									? "text-red-500 hover:text-red-600"
									: "text-muted-foreground hover:text-red-500"
							}`}
							onClick={handleLike}
							disabled={account ? isLikingPost || isUnlikingPost : false}
						>
							<span className="text-xs">
								{account && isLiked ? "Unlike" : "Like"}
							</span>
							{optimisticLikeCount > 0 && (
								<span className="ml-1">{optimisticLikeCount}</span>
							)}
						</Button>
						<CommentPreview commentPreview={post.commentPreview} />
					</div>

					{/* Reply Form */}
					{showReplyForm && (
						<div
							className="mt-3 pl-2 border-l-2 border-border"
							onClick={(e) => e.stopPropagation()}
						>
							<PostForm
								parentId={post.id}
								replyToPost={post}
								onSuccess={handleReplySuccess}
							/>
						</div>
					)}
				</div>
			</div>
		</article>
	);
};
