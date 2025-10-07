import { Button, Card, Input } from "@betterlms/ui";
import { ArrowLeft, Eye } from "lucide-react";
import { useId } from "react";
import { useNavigate, useParams } from "react-router";
import { ArticleEditor } from "../../../components/article-editor";
import { useEditArticle } from "../hooks/use-edit-article";

export const EditArticlePage = () => {
	const navigate = useNavigate();
	const { articleId } = useParams<{ articleId: string }>();
	const titleId = useId();
	const channelId = useId();

	const {
		article,
		isLoadingArticle,
		error,
		formData,
		channels,
		isLoadingChannels,
		handleTitleChange,
		handleContentChange,
		handleChannelChange,
		updateArticle,
		isUpdatingArticle,
		updateError,
		isFormValid,
	} = useEditArticle({
		articleId: articleId || "",
		onSuccess: () => {
			navigate("/dashboard/articles");
		},
	});

	const handleSave = () => {
		updateArticle();
	};

	if (isLoadingArticle) {
		return (
			<div className="space-y-6">
				<div className="flex items-center justify-center h-64">
					<div className="text-gray-500">Loading article...</div>
				</div>
			</div>
		);
	}

	if (error || !article) {
		return (
			<div className="space-y-6">
				<div className="flex items-center justify-center h-64">
					<div className="text-red-500">Article not found</div>
				</div>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-4">
					<Button
						variant="outline"
						size="sm"
						onClick={() => navigate("/dashboard/articles")}
					>
						<ArrowLeft className="h-4 w-4 mr-2" />
						Back to Articles
					</Button>
					<div>
						<h2 className="text-2xl font-bold text-gray-900">
							{formData.title || "Edit Article"}
						</h2>
						<p className="text-sm text-gray-600 mt-1">
							Edit and update your article
						</p>
					</div>
				</div>
				<div className="flex gap-2">
					<Button
						onClick={handleSave}
						disabled={isUpdatingArticle || !isFormValid}
					>
						<Eye className="h-4 w-4 mr-2" />
						{isUpdatingArticle ? "Updating..." : "Update Article"}
					</Button>
				</div>
			</div>

			{/* Error display */}
			{updateError && (
				<div className="bg-red-50 border border-red-200 rounded-md p-4">
					<div className="flex">
						<div className="ml-3">
							<h3 className="text-sm font-medium text-red-800">
								Failed to update article
							</h3>
							<div className="mt-2 text-sm text-red-700">
								{(updateError as any)?.response?.status === 401 && (
									<p>Your session has expired. Please log in again.</p>
								)}
								{(updateError as any)?.response?.status === 403 && (
									<p>You don't have permission to edit this article.</p>
								)}
								{(updateError as any)?.response?.status !== 401 &&
									(updateError as any)?.response?.status !== 403 && (
										<p>An unexpected error occurred. Please try again.</p>
									)}
							</div>
						</div>
					</div>
				</div>
			)}

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				{/* Main content */}
				<div className="lg:col-span-2 space-y-6">
					{/* Article editor */}
					<Card className="p-6">
						<div className="space-y-4">
							<div>
								<label
									htmlFor={titleId}
									className="block text-sm font-medium text-gray-700 mb-2"
								>
									Title *
								</label>
								<Input
									id={titleId}
									placeholder="Enter article title..."
									value={formData.title}
									onChange={(e) => handleTitleChange(e.target.value)}
									className="text-lg"
								/>
							</div>
							<div>
								<div className="block text-sm font-medium text-gray-700 mb-2">
									Content *
								</div>
								<ArticleEditor
									content={formData.content}
									onChange={handleContentChange}
									placeholder="Start writing your article..."
								/>
							</div>
						</div>
					</Card>
				</div>

				{/* Sidebar */}
				<div className="space-y-6">
					{/* Article settings */}
					<Card className="p-6">
						<h3 className="text-lg font-semibold text-gray-900 mb-4">
							Article Settings
						</h3>
						<div className="space-y-4">
							<div>
								<label
									htmlFor={channelId}
									className="block text-sm font-medium text-gray-700 mb-2"
								>
									Channel
								</label>
								<select
									id={channelId}
									value={formData.channelId || ""}
									onChange={(e) => handleChannelChange(e.target.value)}
									className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
									disabled={isLoadingChannels}
								>
									<option value="">Select a channel (optional)</option>
									{channels.map((channel) => (
										<option key={channel.id} value={channel.id}>
											{channel.name}
										</option>
									))}
								</select>
								<p className="text-xs text-gray-500 mt-1">
									Choose a channel to categorize your article
								</p>
							</div>
						</div>
					</Card>

					{/* Article info */}
					<Card className="p-6">
						<h3 className="text-lg font-semibold text-gray-900 mb-4">
							Article Info
						</h3>
						<div className="space-y-3">
							<div className="text-sm">
								<strong>Author:</strong>{" "}
								<span className="text-gray-600">
									{article.user?.name || "Unknown"}
								</span>
							</div>
							<div className="text-sm">
								<strong>Created:</strong>{" "}
								<span className="text-gray-600">
									{new Date(article.createdAt).toLocaleDateString()}
								</span>
							</div>
							<div className="text-sm">
								<strong>Last Updated:</strong>{" "}
								<span className="text-gray-600">
									{new Date(article.updatedAt).toLocaleDateString()}
								</span>
							</div>
							<div className="text-sm">
								<strong>Channel:</strong>{" "}
								<span className="text-gray-600">
									{formData.channelId
										? channels.find((c) => c.id === formData.channelId)?.name ||
											"Unknown"
										: "None"}
								</span>
							</div>
							<div className="text-sm">
								<strong>Likes:</strong>{" "}
								<span className="text-gray-600">{article.likeCount}</span>
							</div>
							<div className="text-sm">
								<strong>Comments:</strong>{" "}
								<span className="text-gray-600">{article.replyCount}</span>
							</div>
						</div>
					</Card>

					{/* Word count */}
					<Card className="p-6">
						<h3 className="text-lg font-semibold text-gray-900 mb-4">
							Statistics
						</h3>
						<div className="space-y-2 text-sm">
							<div className="flex justify-between">
								<span className="text-gray-600">Words:</span>
								<span className="font-medium">
									{
										formData.content
											.replace(/<[^>]*>/g, "")
											.split(/\s+/)
											.filter(Boolean).length
									}
								</span>
							</div>
							<div className="flex justify-between">
								<span className="text-gray-600">Characters:</span>
								<span className="font-medium">
									{formData.content.replace(/<[^>]*>/g, "").length}
								</span>
							</div>
						</div>
					</Card>
				</div>
			</div>
		</div>
	);
};
