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
import { useNavigate, useParams } from "react-router";
import { useAccount } from "@/features/account/hooks/use-account";
import { useArticle } from "@/features/articles/hooks/use-article";
import { useProcessedContent } from "@/features/articles/hooks/use-processed-content";
import { loginDialogAtom } from "@/features/auth/atoms/login-dialog-atom";
import { useLikePost } from "@/features/likes/hooks/use-like-post";
import { useUnlikePost } from "@/features/likes/hooks/use-unlike-post";
import { CommentPreview } from "@/features/posts/components/comment-preview";
import { PostForm } from "@/features/posts/components/post-form";
import { PostMedia } from "@/features/posts/components/post-media";
import { useDeletePost } from "@/features/posts/hooks/use-delete-post";

export const ArticleDetailPage = () => {
	const { id } = useParams<{ id: string }>();
	const navigate = useNavigate();
	const { account } = useAccount();
	const { deletePost, isDeletingPost } = useDeletePost();
	const { likePost, isLikingPost } = useLikePost();
	const { unlikePost, isUnlikingPost } = useUnlikePost();
	const setLoginDialog = useSetAtom(loginDialogAtom);

	const { data: article, isLoading, error } = useArticle(id || "");
	const { processedContent } = useProcessedContent({
		content: article?.content || "",
	});

	const [isLiked, setIsLiked] = useState(false);
	const [optimisticLikeCount, setOptimisticLikeCount] = useState(0);
	const [showReplyForm, setShowReplyForm] = useState(false);

	// Sync state when article data loads
	useEffect(() => {
		if (article) {
			setIsLiked(article.isLiked);
			setOptimisticLikeCount(article.likeCount);
		}
	}, [article]);

	if (!id) {
		return (
			<div className="text-center py-8">
				<p className="text-muted-foreground">Article ID is required</p>
			</div>
		);
	}

	if (isLoading) {
		return (
			<div className="p-6 max-w-full overflow-hidden">
				<div className="space-y-6">
					{/* Header skeleton */}
					<div className="space-y-4">
						<div className="h-8 bg-muted rounded animate-pulse w-3/4" />
						<div className="flex items-center gap-3">
							<div className="size-12 bg-muted rounded-full animate-pulse" />
							<div className="space-y-2">
								<div className="h-4 bg-muted rounded animate-pulse w-32" />
								<div className="h-3 bg-muted rounded animate-pulse w-24" />
							</div>
						</div>
					</div>

					{/* Content skeleton */}
					<div className="space-y-3">
						{[1, 2, 3, 4, 5].map((i) => (
							<div key={i} className="h-4 bg-muted rounded animate-pulse" />
						))}
					</div>
				</div>
			</div>
		);
	}

	if (error || !article) {
		return (
			<div className="p-6 max-w-full overflow-hidden">
				<div className="text-center py-8">
					<p className="text-muted-foreground">Failed to load article</p>
				</div>
			</div>
		);
	}

	const isCurrentUser = account?.user?.id === article.user?.id;

	const handleDelete = () => {
		deletePost(article.id);
		navigate("/articles");
	};

	const handleReport = () => {
		console.log("Report article:", article.id);
	};

	const handleReply = () => {
		if (!account) {
			setLoginDialog(true);
			return;
		}
		setShowReplyForm((prev) => !prev);
	};

	const handleLike = () => {
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

	const handleUsernameClick = () => {
		if (article.user?.username) {
			navigate(`/profile/${article.user.username}`);
		}
	};

	return (
		<div className="p-6 max-w-full overflow-hidden">
			<article className="space-y-6">
				{/* Header */}
				<header className="space-y-4">
					<h1 className="text-3xl font-bold leading-tight">{article.title}</h1>

					{/* Author info */}
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-3">
							<Avatar className="size-12">
								<AvatarImage
									src={article.user?.imageUrl || ""}
									alt={article.user?.name || ""}
								/>
								<AvatarFallback>
									{article.user ? getUserInitials(article.user.name) : "?"}
								</AvatarFallback>
							</Avatar>
							<div>
								<button
									type="button"
									onClick={handleUsernameClick}
									className="font-semibold hover:underline"
								>
									{article.user?.name || "Unknown"}
								</button>
								<div className="flex items-center gap-2 text-sm text-muted-foreground">
									<button
										type="button"
										onClick={handleUsernameClick}
										className="hover:underline"
									>
										@{article.user?.username || "unknown"}
									</button>
									<span>·</span>
									<span>{getRelativeTime(article.createdAt)}</span>
								</div>
							</div>
						</div>

						{/* Actions */}
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button variant="ghost" size="sm">
									<span className="text-lg">⋯</span>
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
					{article.channel && (
						<div>
							<span className="text-sm text-muted-foreground bg-muted px-3 py-1 rounded-full">
								#{article.channel.name}
							</span>
						</div>
					)}
				</header>

				{/* Content */}
				<div className="text-sm">
					<div className="prose prose-pre:whitespace-pre-line">
						{typeof processedContent === "string" ? (
							<div
								// biome-ignore lint/security/noDangerouslySetInnerHtml: This is intentional for rendering article HTML content
								dangerouslySetInnerHTML={{ __html: processedContent }}
							/>
						) : (
							<div>{processedContent}</div>
						)}
					</div>
				</div>

				{/* Media */}
				{article.Media && <PostMedia media={article.Media} />}

				{/* Actions */}
				<div className="flex items-center gap-4 pt-4 border-t">
					<Button
						variant="ghost"
						className={`${
							showReplyForm
								? "text-primary"
								: "text-muted-foreground hover:text-primary"
						}`}
						onClick={handleReply}
					>
						Reply
					</Button>
					<Button
						variant="ghost"
						className={`${
							isLiked && account
								? "text-red-500 hover:text-red-600"
								: "text-muted-foreground hover:text-red-500"
						}`}
						onClick={handleLike}
						disabled={account ? isLikingPost || isUnlikingPost : false}
					>
						{account && isLiked ? "Unlike" : "Like"}
						{optimisticLikeCount > 0 && (
							<span className="ml-2">{optimisticLikeCount}</span>
						)}
					</Button>
					<CommentPreview commentPreview={article.commentPreview} />
				</div>

				{/* Reply Form */}
				{showReplyForm && (
					<div className="pt-4 border-t">
						<PostForm
							parentId={article.id}
							replyToPost={article}
							onSuccess={handleReplySuccess}
						/>
					</div>
				)}
			</article>
		</div>
	);
};
