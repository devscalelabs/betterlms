import { Button, Card, Input } from "@betterlms/ui";
import { ArrowLeft, Eye } from "lucide-react";
import { useId } from "react";
import { useNavigate, useParams } from "react-router";
import { ArticleEditor } from "../../../components/article-editor";
import { useEditLesson } from "../hooks/use-edit-lesson";

export const EditLessonPage = () => {
	const navigate = useNavigate();
	const { lessonId } = useParams<{ lessonId: string }>();
	const titleId = useId();
	const videoUrlId = useId();
	const isFreeId = useId();

	const {
		lesson,
		isLoadingLesson,
		error,
		formData,
		handleTitleChange,
		handleContentChange,
		handleVideoUrlChange,
		handleIsFreeChange,
		updateLesson,
		isUpdatingLesson,
		updateError,
		isFormValid,
	} = useEditLesson({
		lessonId: lessonId || "",
		onSuccess: () => {
			navigate("/dashboard/courses");
		},
	});

	const handleSave = () => {
		updateLesson();
	};

	if (isLoadingLesson) {
		return (
			<div className="space-y-6">
				<div className="flex items-center justify-center h-64">
					<div className="text-gray-500">Loading lesson...</div>
				</div>
			</div>
		);
	}

	if (error || !lesson) {
		return (
			<div className="space-y-6">
				<div className="flex items-center justify-center h-64">
					<div className="text-red-500">Lesson not found</div>
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
						onClick={() => navigate("/dashboard/courses")}
					>
						<ArrowLeft className="h-4 w-4 mr-2" />
						Back to Courses
					</Button>
					<div>
						<h2 className="text-2xl font-bold text-gray-900">
							{formData.title || "Edit Lesson"}
						</h2>
						<p className="text-sm text-gray-600 mt-1">
							Edit and update your lesson
						</p>
					</div>
				</div>
				<div className="flex gap-2">
					<Button
						onClick={handleSave}
						disabled={isUpdatingLesson || !isFormValid}
					>
						<Eye className="h-4 w-4 mr-2" />
						{isUpdatingLesson ? "Updating..." : "Update Lesson"}
					</Button>
				</div>
			</div>

			{/* Error display */}
			{updateError && (
				<div className="bg-red-50 border border-red-200 rounded-md p-4">
					<div className="flex">
						<div className="ml-3">
							<h3 className="text-sm font-medium text-red-800">
								Failed to update lesson
							</h3>
							<div className="mt-2 text-sm text-red-700">
								{(updateError as { response?: { status?: number } })?.response
									?.status === 401 && (
									<p>Your session has expired. Please log in again.</p>
								)}
								{(updateError as { response?: { status?: number } })?.response
									?.status === 403 && (
									<p>You don't have permission to edit this lesson.</p>
								)}
								{(updateError as { response?: { status?: number } })?.response
									?.status !== 401 &&
									(updateError as { response?: { status?: number } })?.response
										?.status !== 403 && (
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
					{/* Lesson editor */}
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
									placeholder="Enter lesson title..."
									value={formData.title || ""}
									onChange={(e) => handleTitleChange(e.target.value)}
									className="text-lg"
								/>
							</div>
							<div>
								<label
									htmlFor={videoUrlId}
									className="block text-sm font-medium text-gray-700 mb-2"
								>
									Video URL
								</label>
								<Input
									id={videoUrlId}
									placeholder="Enter video URL (YouTube, Vimeo, etc.)..."
									value={formData.videoUrl || ""}
									onChange={(e) => handleVideoUrlChange(e.target.value)}
								/>
								<p className="text-xs text-gray-500 mt-1">
									Supported: YouTube, Vimeo, or direct video URLs
								</p>
							</div>
							<div>
								<div className="block text-sm font-medium text-gray-700 mb-2">
									Content
								</div>
								<ArticleEditor
									content={formData.content || ""}
									onChange={handleContentChange}
									placeholder="Start writing your lesson content..."
								/>
							</div>
						</div>
					</Card>
				</div>

				{/* Sidebar */}
				<div className="space-y-6">
					{/* Lesson settings */}
					<Card className="p-6">
						<h3 className="text-lg font-semibold text-gray-900 mb-4">
							Lesson Settings
						</h3>
						<div className="space-y-4">
							<div>
								<div className="flex items-center space-x-3">
									<input
										id={isFreeId}
										type="checkbox"
										checked={formData.isFree || false}
										onChange={(e) => handleIsFreeChange(e.target.checked)}
										className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
									/>
									<label
										htmlFor={isFreeId}
										className="text-sm font-medium text-gray-700"
									>
										Free Preview
									</label>
								</div>
								<p className="text-xs text-gray-500 mt-1">
									Make this lesson available for free preview
								</p>
							</div>
						</div>
					</Card>

					{/* Lesson info */}
					<Card className="p-6">
						<h3 className="text-lg font-semibold text-gray-900 mb-4">
							Lesson Info
						</h3>
						<div className="space-y-3">
							<div className="text-sm">
								<strong>Type:</strong>{" "}
								<span className="text-gray-600">
									{lesson.type === "VIDEO" ? "Video" : "Text"}
								</span>
							</div>
							<div className="text-sm">
								<strong>Order:</strong>{" "}
								<span className="text-gray-600">{lesson.order}</span>
							</div>
							<div className="text-sm">
								<strong>Created:</strong>{" "}
								<span className="text-gray-600">
									{new Date(lesson.createdAt).toLocaleDateString()}
								</span>
							</div>
							<div className="text-sm">
								<strong>Last Updated:</strong>{" "}
								<span className="text-gray-600">
									{new Date(lesson.updatedAt).toLocaleDateString()}
								</span>
							</div>
							<div className="text-sm">
								<strong>Free Preview:</strong>{" "}
								<span className="text-gray-600">
									{lesson.isFree ? "Yes" : "No"}
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
										(formData.content || "")
											.replace(/<[^>]*>/g, "")
											.split(/\s+/)
											.filter(Boolean).length
									}
								</span>
							</div>
							<div className="flex justify-between">
								<span className="text-gray-600">Characters:</span>
								<span className="font-medium">
									{(formData.content || "").replace(/<[^>]*>/g, "").length}
								</span>
							</div>
						</div>
					</Card>
				</div>
			</div>
		</div>
	);
};
