import { Button, Card, Input } from "@betterlms/ui";
import { ArrowLeft, Eye, Upload, X } from "lucide-react";
import { useId } from "react";
import { useNavigate } from "react-router";
import { ArticleEditor } from "../components/article-editor";
import { DashboardLayout } from "../components/dashboard-layout";
import { useCreateArticle } from "../features/articles/hooks/use-create-article";

export const CreateArticlePage = () => {
	const navigate = useNavigate();
	const titleId = useId();
	const channelId = useId();
	const imageUploadId = useId();

	const {
		formData,
		channels,
		isLoadingChannels,
		handleTitleChange,
		handleContentChange,
		handleChannelChange,
		handleFileChange,
		removeImage,
		createArticle,
		isCreatingArticle,
		isFormValid,
		generateSlug,
		selectedImages,
		handleImageUpload,
	} = useCreateArticle({
		onSuccess: () => {
			navigate("/dashboard/articles");
		},
	});

	const handleSave = () => {
		createArticle();
	};

	return (
		<DashboardLayout>
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
								{formData.title || "Create New Article"}
							</h2>
							<p className="text-sm text-gray-600 mt-1">
								Write and publish your article
							</p>
						</div>
					</div>
					<div className="flex gap-2">
						<Button
							onClick={handleSave}
							disabled={isCreatingArticle || !isFormValid}
						>
							<Eye className="h-4 w-4 mr-2" />
							{isCreatingArticle ? "Publishing..." : "Publish Article"}
						</Button>
					</div>
				</div>

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
										onImageUpload={handleImageUpload}
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
								<div>
									<label
										htmlFor={imageUploadId}
										className="block text-sm font-medium text-gray-700 mb-2"
									>
										Images
									</label>
									<div className="space-y-2">
										<input
											type="file"
											id={imageUploadId}
											multiple
											accept="image/png,image/jpeg"
											onChange={handleFileChange}
											className="hidden"
										/>
										<Button
											variant="outline"
											size="sm"
											onClick={() =>
												document.getElementById(imageUploadId)?.click()
											}
											className="w-full"
										>
											<Upload className="h-4 w-4 mr-2" />
											Upload Images
										</Button>
										{selectedImages.length > 0 && (
											<div className="space-y-2">
												<p className="text-xs text-gray-500">
													{selectedImages.length} image(s) selected
												</p>
												<div className="space-y-1">
													{selectedImages.map((image, index) => (
														<div
															key={`${image.name}-${index}`}
															className="flex items-center justify-between p-2 bg-gray-50 rounded text-sm"
														>
															<span className="truncate flex-1 mr-2">
																{image.name}
															</span>
															<Button
																variant="outline"
																size="sm"
																onClick={() => removeImage(index)}
																className="h-6 w-6 p-0"
															>
																<X className="h-3 w-3" />
															</Button>
														</div>
													))}
												</div>
											</div>
										)}
									</div>
									<p className="text-xs text-gray-500 mt-1">
										Upload up to 10 images (PNG, JPEG only)
									</p>
								</div>
							</div>
						</Card>

						{/* Article preview */}
						<Card className="p-6">
							<h3 className="text-lg font-semibold text-gray-900 mb-4">
								Preview
							</h3>
							<div className="space-y-3">
								<div className="text-sm">
									<strong>Title:</strong>{" "}
									<span className="text-gray-600">
										{formData.title || "Untitled"}
									</span>
								</div>
								<div className="text-sm">
									<strong>Slug:</strong>{" "}
									<span className="text-gray-600">
										{formData.title
											? generateSlug(formData.title)
											: "auto-generated"}
									</span>
								</div>
								<div className="text-sm">
									<strong>Channel:</strong>{" "}
									<span className="text-gray-600">
										{formData.channelId
											? channels.find((c) => c.id === formData.channelId)
													?.name || "Unknown"
											: "None"}
									</span>
								</div>
								<div className="text-sm">
									<strong>Images:</strong>{" "}
									<span className="text-gray-600">
										{selectedImages.length} image(s)
									</span>
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
								<div className="flex justify-between">
									<span className="text-gray-600">Images:</span>
									<span className="font-medium">{selectedImages.length}</span>
								</div>
							</div>
						</Card>
					</div>
				</div>
			</div>
		</DashboardLayout>
	);
};
