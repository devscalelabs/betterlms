import { Button, Card, Input } from "@betterlms/ui";
import { ArrowLeft, Eye, Save } from "lucide-react";
import { useId, useState } from "react";
import { useNavigate } from "react-router";
import { ArticleEditor } from "../components/article-editor";
import { DashboardLayout } from "../components/dashboard-layout";

export const CreateArticlePage = () => {
	const navigate = useNavigate();
	const titleId = useId();
	const excerptId = useId();
	const slugId = useId();
	const draftId = useId();
	const [title, setTitle] = useState("");
	const [slug, setSlug] = useState("");
	const [excerpt, setExcerpt] = useState("");
	const [content, setContent] = useState("");
	const [isDraft, setIsDraft] = useState(true);
	const [isSaving, setIsSaving] = useState(false);

	const handleSave = async (asDraft: boolean) => {
		setIsSaving(true);
		try {
			// TODO: Implement API call to save article
			console.log("Saving article:", {
				title,
				slug,
				excerpt,
				content,
				isDraft: asDraft,
			});

			// Simulate API call
			await new Promise((resolve) => setTimeout(resolve, 1000));

			// Navigate back to articles list
			navigate("/dashboard/articles");
		} catch (error) {
			console.error("Failed to save article:", error);
		} finally {
			setIsSaving(false);
		}
	};

	const generateSlug = (title: string) => {
		return title
			.toLowerCase()
			.replace(/[^a-z0-9\s-]/g, "")
			.replace(/\s+/g, "-")
			.replace(/-+/g, "-")
			.trim();
	};

	const handleTitleChange = (newTitle: string) => {
		setTitle(newTitle);
		if (!slug || slug === generateSlug(title)) {
			setSlug(generateSlug(newTitle));
		}
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
								{title || "Create New Article"}
							</h2>
							<p className="text-sm text-gray-600 mt-1">
								Write and publish your article
							</p>
						</div>
					</div>
					<div className="flex gap-2">
						<Button
							variant="outline"
							onClick={() => handleSave(true)}
							disabled={isSaving || !title.trim()}
						>
							<Save className="h-4 w-4 mr-2" />
							{isSaving ? "Saving..." : "Save as Draft"}
						</Button>
						<Button
							onClick={() => handleSave(false)}
							disabled={isSaving || !title.trim() || !content.trim()}
						>
							<Eye className="h-4 w-4 mr-2" />
							{isSaving ? "Publishing..." : "Publish"}
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
										value={title}
										onChange={(e) => handleTitleChange(e.target.value)}
										className="text-lg"
									/>
								</div>
								<div>
									<label
										htmlFor={excerptId}
										className="block text-sm font-medium text-gray-700 mb-2"
									>
										Excerpt
									</label>
									<Input
										id={excerptId}
										placeholder="Brief description of the article..."
										value={excerpt}
										onChange={(e) => setExcerpt(e.target.value)}
									/>
								</div>
								<div>
									<div className="block text-sm font-medium text-gray-700 mb-2">
										Content *
									</div>
									<ArticleEditor
										content={content}
										onChange={setContent}
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
										htmlFor={slugId}
										className="block text-sm font-medium text-gray-700 mb-2"
									>
										Slug
									</label>
									<Input
										id={slugId}
										placeholder="article-slug"
										value={slug}
										onChange={(e) => setSlug(e.target.value)}
									/>
									<p className="text-xs text-gray-500 mt-1">
										URL-friendly version of the title
									</p>
								</div>
								<div>
									<label
										htmlFor={draftId}
										className="block text-sm font-medium text-gray-700 mb-2"
									>
										Status
									</label>
									<div className="flex items-center gap-2">
										<input
											type="checkbox"
											id={draftId}
											checked={isDraft}
											onChange={(e) => setIsDraft(e.target.checked)}
											className="rounded border-gray-300"
										/>
										<label htmlFor={draftId} className="text-sm text-gray-700">
											Save as draft
										</label>
									</div>
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
									<span className="text-gray-600">{title || "Untitled"}</span>
								</div>
								<div className="text-sm">
									<strong>Slug:</strong>{" "}
									<span className="text-gray-600">
										{slug || "auto-generated"}
									</span>
								</div>
								<div className="text-sm">
									<strong>Status:</strong>{" "}
									<span className="text-gray-600">
										{isDraft ? "Draft" : "Published"}
									</span>
								</div>
								{excerpt && (
									<div className="text-sm">
										<strong>Excerpt:</strong>{" "}
										<span className="text-gray-600">{excerpt}</span>
									</div>
								)}
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
											content
												.replace(/<[^>]*>/g, "")
												.split(/\s+/)
												.filter(Boolean).length
										}
									</span>
								</div>
								<div className="flex justify-between">
									<span className="text-gray-600">Characters:</span>
									<span className="font-medium">
										{content.replace(/<[^>]*>/g, "").length}
									</span>
								</div>
							</div>
						</Card>
					</div>
				</div>
			</div>
		</DashboardLayout>
	);
};
