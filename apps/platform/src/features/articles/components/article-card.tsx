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
import { CommentPreview } from "@/features/posts/components/comment-preview";
import { PostForm } from "@/features/posts/components/post-form";
import { PostMedia } from "@/features/posts/components/post-media";
import { useDeletePost } from "@/features/posts/hooks/use-delete-post";
import type { Article } from "../types";

interface ArticleCardProps {
	article: Article;
	isDetailView?: boolean;
}

// Safe function to truncate HTML content for preview
const getTruncatedContent = (
	htmlContent: string,
	maxLength: number = 300,
): string => {
	// Remove HTML tags to get plain text length
	const textContent = htmlContent.replace(/<[^>]*>/g, "");

	// If content is already short enough, return as is
	if (textContent.length <= maxLength) {
		return htmlContent;
	}

	// Find a good truncation point (end of sentence or word)
	let truncatedText = textContent.substring(0, maxLength);
	const lastSentence = truncatedText.lastIndexOf(".");
	const lastWord = truncatedText.lastIndexOf(" ");

	// Prefer to cut at sentence end, then word end
	const cutPoint = lastSentence > maxLength * 0.7 ? lastSentence + 1 : lastWord;

	if (cutPoint > 0) {
		truncatedText = truncatedText.substring(0, cutPoint);
	}

	// Reconstruct HTML by finding the corresponding position in original HTML
	let textPosition = 0;
	let result = "";
	let inTag = false;

	for (
		let i = 0;
		i < htmlContent.length && textPosition < truncatedText.length;
		i++
	) {
		const char = htmlContent[i];

		if (char === "<") {
			inTag = true;
		} else if (char === ">") {
			inTag = false;
		}

		if (inTag) {
			result += char;
		} else {
			if (textPosition < truncatedText.length) {
				result += char;
				textPosition++;
			}
		}
	}

	// Add ellipsis if content was truncated
	if (textContent.length > maxLength) {
		result += "...";
	}

	return result;
};

export const ArticleCard = ({
	article,
	isDetailView = false,
}: ArticleCardProps) => {
	const navigate = useNavigate();
	const { account } = useAccount();
	const { deletePost, isDeletingPost } = useDeletePost();
	const { likePost, isLikingPost } = useLikePost();
	const { unlikePost, isUnlikingPost } = useUnlikePost();
	const setLoginDialog = useSetAtom(loginDialogAtom);
	const isCurrentUser = account?.user?.id === article.user?.id;

	const [isLiked, setIsLiked] = useState(article.isLiked);
	const [optimisticLikeCount, setOptimisticLikeCount] = useState(
		article.likeCount,
	);
	const [showReplyForm, setShowReplyForm] = useState(false);

	// Sync isLiked state when article prop changes
	useEffect(() => {
		setIsLiked(article.isLiked);
	}, [article.isLiked]);

	// Sync optimisticLikeCount when article.likeCount changes
	useEffect(() => {
		setOptimisticLikeCount(article.likeCount);
	}, [article.likeCount]);

	const handleDelete = (e: React.MouseEvent) => {
		e.stopPropagation();
		deletePost(article.id);
	};

	const handleReport = (e: React.MouseEvent) => {
		e.stopPropagation();
		console.log("Report article:", article.id);
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
			unlikePost(article.id);
		} else {
			setIsLiked(true);
			setOptimisticLikeCount((prev) => prev + 1);
			likePost(article.id);
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
			navigate(`/article/${article.id}`);
		}
	};

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (!isDetailView && (e.key === "Enter" || e.key === " ")) {
			e.preventDefault();
			navigate(`/article/${article.id}`);
		}
	};

	const handleUsernameClick = (e: React.MouseEvent) => {
		e.stopPropagation();
		if (article.user?.username) {
			navigate(`/profile/${article.user.username}`);
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
						src={article.user?.imageUrl || ""}
						alt={article.user?.name || ""}
					/>
					<AvatarFallback>
						{article.user ? getUserInitials(article.user.name) : "?"}
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
								{article.user?.name || "Unknown"}
							</button>
							<button
								type="button"
								onClick={handleUsernameClick}
								className="text-muted-foreground text-sm hover:underline"
							>
								@{article.user?.username || "unknown"}
							</button>
							<span className="text-muted-foreground text-sm">·</span>
							<span className="text-muted-foreground text-sm">
								{getRelativeTime(article.createdAt)}
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
					{article.channel && (
						<div className="mb-2">
							<span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
								#{article.channel.name}
							</span>
						</div>
					)}

					{/* Title */}
					<h2 className="text-lg font-semibold mb-2 leading-tight">
						{article.title}
					</h2>

					{/* Content - Render HTML directly */}
					<div
						className="text-sm leading-relaxed mb-3 [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:mb-4 [&_h1]:mt-6 [&_h1]:text-foreground [&_h2]:text-xl [&_h2]:font-bold [&_h2]:mb-3 [&_h2]:mt-5 [&_h2]:text-foreground [&_h3]:text-lg [&_h3]:font-bold [&_h3]:mb-2 [&_h3]:mt-4 [&_h3]:text-foreground [&_h4]:text-base [&_h4]:font-bold [&_h4]:mb-2 [&_h4]:mt-3 [&_h4]:text-foreground [&_h5]:text-sm [&_h5]:font-bold [&_h5]:mb-1 [&_h5]:mt-2 [&_h5]:text-foreground [&_h6]:text-sm [&_h6]:font-semibold [&_h6]:mb-1 [&_h6]:mt-2 [&_h6]:text-foreground [&_p]:mb-3 [&_p]:text-foreground [&_p]:leading-relaxed [&_strong]:font-bold [&_strong]:text-foreground [&_em]:italic [&_em]:text-foreground [&_code]:bg-muted [&_code]:px-1 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-sm [&_code]:font-mono [&_code]:text-foreground [&_pre]:bg-muted [&_pre]:p-4 [&_pre]:rounded-lg [&_pre]:overflow-x-auto [&_pre]:text-sm [&_pre]:font-mono [&_pre]:text-foreground [&_pre]:mb-4 [&_blockquote]:border-l-4 [&_blockquote]:border-muted-foreground [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-muted-foreground [&_blockquote]:mb-4 [&_ul]:list-disc [&_ul]:list-inside [&_ul]:mb-4 [&_ul]:text-foreground [&_ol]:list-decimal [&_ol]:list-inside [&_ol]:mb-4 [&_ol]:text-foreground [&_li]:mb-1 [&_li]:text-foreground [&_a]:text-primary [&_a]:underline [&_a]:hover:text-primary/80"
						// biome-ignore lint/security/noDangerouslySetInnerHtml: This is intentional for rendering article HTML content
						dangerouslySetInnerHTML={{
							__html: isDetailView
								? article.content
								: getTruncatedContent(article.content),
						}}
					/>

					{/* Media */}
					{article.Media && <PostMedia media={article.Media} />}

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
						<CommentPreview commentPreview={article.commentPreview} />
					</div>

					{/* Reply Form */}
					{showReplyForm && (
						// biome-ignore lint/a11y/noStaticElementInteractions: This is a static element that is used to stop event propagation
						// biome-ignore lint/a11y/useKeyWithClickEvents: onClick is used to stop event propagation, not for interaction
						<div
							className="mt-3 pl-2 border-l-2 border-border"
							onClick={(e) => e.stopPropagation()}
						>
							<PostForm
								parentId={article.id}
								replyToPost={article}
								onSuccess={handleReplySuccess}
							/>
						</div>
					)}
				</div>
			</div>
		</article>
	);
};
