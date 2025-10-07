import { Button, Card, Input, Textarea } from "@betterlms/ui";
import { ArrowLeft, BookOpen, FileText, Plus, Video } from "lucide-react";
import { useId, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useCourse } from "../hooks/use-course";
import { useCreateLesson } from "../hooks/use-create-lesson";
import { useCreateSection } from "../hooks/use-create-section";

export const EditCoursePage = () => {
	const { courseId } = useParams<{ courseId: string }>();
	const navigate = useNavigate();
	const [selectedSectionId, setSelectedSectionId] = useState<string | null>(
		null,
	);
	const [showCreateSection, setShowCreateSection] = useState(false);
	const [showCreateLesson, setShowCreateLesson] = useState(false);

	// Generate unique IDs for form elements
	const sectionTitleId = useId();
	const sectionOrderId = useId();
	const lessonTitleId = useId();
	const lessonOrderId = useId();
	const lessonTypeId = useId();
	const lessonVideoUrlId = useId();
	const lessonIsFreeId = useId();
	const lessonContentId = useId();

	const { course, isCourseLoading } = useCourse(courseId || "");

	const {
		formData: sectionFormData,
		handleTitleChange: handleSectionTitleChange,
		handleOrderChange: handleSectionOrderChange,
		createSection,
		isCreatingSection,
		isFormValid: isSectionFormValid,
	} = useCreateSection({
		courseId: courseId || "",
		onSuccess: () => {
			setShowCreateSection(false);
		},
	});

	const {
		formData: lessonFormData,
		handleTitleChange: handleLessonTitleChange,
		handleContentChange: handleLessonContentChange,
		handleOrderChange: handleLessonOrderChange,
		handleTypeChange: handleLessonTypeChange,
		handleVideoUrlChange: handleLessonVideoUrlChange,
		handleIsFreeChange: handleLessonIsFreeChange,
		createLesson,
		isCreatingLesson,
		isFormValid: isLessonFormValid,
	} = useCreateLesson({
		courseId: courseId || "",
		sectionId: selectedSectionId || "",
		onSuccess: () => {
			setShowCreateLesson(false);
		},
	});

	if (isCourseLoading) {
		return (
			<div className="container mx-auto py-6">
				<div className="flex items-center justify-center h-64">
					<div className="text-muted-foreground">Loading course...</div>
				</div>
			</div>
		);
	}

	if (!course) {
		return (
			<div className="container mx-auto py-6">
				<div className="flex items-center justify-center h-64">
					<div className="text-muted-foreground">Course not found</div>
				</div>
			</div>
		);
	}

	const handleCreateSection = () => {
		if (isSectionFormValid) {
			createSection();
		}
	};

	const handleCreateLesson = () => {
		if (isLessonFormValid && selectedSectionId) {
			createLesson();
		}
	};

	return (
		<div className="container mx-auto py-6">
			<div className="space-y-6">
				<div className="flex items-center gap-4">
					<Button
						variant="outline"
						size="sm"
						onClick={() => navigate("/dashboard/courses")}
					>
						<ArrowLeft className="mr-2 h-4 w-4" />
						Back to Courses
					</Button>
					<div>
						<h1 className="text-3xl font-bold">{course.title}</h1>
						<p className="text-muted-foreground">
							Manage course content and structure
						</p>
					</div>
				</div>

				{/* Course Info */}
				<Card className="p-6">
					<div className="mb-4">
						<h2 className="text-xl font-semibold">Course Information</h2>
					</div>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div>
							<span className="text-sm font-medium">Title</span>
							<p className="text-sm text-muted-foreground">{course.title}</p>
						</div>
						<div>
							<span className="text-sm font-medium">Status</span>
							<p className="text-sm text-muted-foreground">
								{course.isPublished ? "Published" : "Draft"}
							</p>
						</div>
						<div>
							<span className="text-sm font-medium">Enrollments</span>
							<p className="text-sm text-muted-foreground">
								{course._count.enrollments} students
							</p>
						</div>
						<div>
							<span className="text-sm font-medium">Instructor</span>
							<p className="text-sm text-muted-foreground">
								{course.instructor.name}
							</p>
						</div>
					</div>
				</Card>

				{/* Sections */}
				<div className="space-y-4">
					<div className="flex items-center justify-between">
						<h2 className="text-2xl font-bold">Course Sections</h2>
						<Button
							onClick={() => setShowCreateSection(true)}
							disabled={showCreateSection}
						>
							<Plus className="mr-2 h-4 w-4" />
							Add Section
						</Button>
					</div>

					{/* Create Section Form */}
					{showCreateSection && (
						<Card className="p-6">
							<div className="mb-4">
								<h3 className="text-lg font-semibold">Create New Section</h3>
							</div>
							<div className="space-y-4">
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<div className="space-y-2">
										<label
											htmlFor={sectionTitleId}
											className="text-sm font-medium"
										>
											Section Title *
										</label>
										<Input
											id={sectionTitleId}
											value={sectionFormData.title}
											onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
												handleSectionTitleChange(e.target.value)
											}
											placeholder="Enter section title"
										/>
									</div>
									<div className="space-y-2">
										<label
											htmlFor={sectionOrderId}
											className="text-sm font-medium"
										>
											Order
										</label>
										<Input
											id={sectionOrderId}
											type="number"
											value={sectionFormData.order}
											onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
												handleSectionOrderChange(Number(e.target.value))
											}
											placeholder="0"
										/>
									</div>
								</div>
								<div className="flex justify-end space-x-2">
									<Button
										variant="outline"
										onClick={() => setShowCreateSection(false)}
									>
										Cancel
									</Button>
									<Button
										onClick={handleCreateSection}
										disabled={!isSectionFormValid || isCreatingSection}
									>
										{isCreatingSection ? "Creating..." : "Create Section"}
									</Button>
								</div>
							</div>
						</Card>
					)}

					{/* Sections List */}
					{course.sections.length === 0 ? (
						<Card className="p-6">
							<div className="text-center text-muted-foreground">
								<BookOpen className="mx-auto h-12 w-12 mb-4" />
								<h3 className="text-lg font-semibold mb-2">No sections yet</h3>
								<p>
									Create your first section to start building your course
									content.
								</p>
							</div>
						</Card>
					) : (
						<div className="space-y-4">
							{course.sections.map((section) => (
								<Card key={section.id} className="p-6">
									<div className="mb-4">
										<div className="flex items-center justify-between">
											<h3 className="text-lg font-semibold">{section.title}</h3>
											<Button
												size="sm"
												onClick={() => {
													setSelectedSectionId(section.id);
													setShowCreateLesson(true);
												}}
												disabled={showCreateLesson}
											>
												<Plus className="mr-2 h-4 w-4" />
												Add Lesson
											</Button>
										</div>
									</div>

									{/* Create Lesson Form */}
									{showCreateLesson && selectedSectionId === section.id && (
										<div className="mb-6 p-4 border rounded-lg bg-gray-50">
											<div className="mb-4">
												<h4 className="font-semibold">Create New Lesson</h4>
											</div>
											<div className="space-y-4">
												<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
													<div className="space-y-2">
														<label
															htmlFor={lessonTitleId}
															className="text-sm font-medium"
														>
															Lesson Title *
														</label>
														<Input
															id={lessonTitleId}
															value={lessonFormData.title}
															onChange={(
																e: React.ChangeEvent<HTMLInputElement>,
															) => handleLessonTitleChange(e.target.value)}
															placeholder="Enter lesson title"
														/>
													</div>
													<div className="space-y-2">
														<label
															htmlFor={lessonOrderId}
															className="text-sm font-medium"
														>
															Order
														</label>
														<Input
															id={lessonOrderId}
															type="number"
															value={lessonFormData.order}
															onChange={(
																e: React.ChangeEvent<HTMLInputElement>,
															) =>
																handleLessonOrderChange(Number(e.target.value))
															}
															placeholder="0"
														/>
													</div>
												</div>
												<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
													<div className="space-y-2">
														<label
															htmlFor={lessonTypeId}
															className="text-sm font-medium"
														>
															Type
														</label>
														<select
															id={lessonTypeId}
															value={lessonFormData.type}
															onChange={(
																e: React.ChangeEvent<HTMLSelectElement>,
															) =>
																handleLessonTypeChange(
																	e.target.value as "VIDEO" | "TEXT",
																)
															}
															className="w-full px-3 py-2 border border-gray-300 rounded-md"
														>
															<option value="TEXT">Text Lesson</option>
															<option value="VIDEO">Video Lesson</option>
														</select>
													</div>
													<div className="space-y-2">
														<label
															htmlFor={lessonIsFreeId}
															className="text-sm font-medium"
														>
															Free Preview
														</label>
														<input
															id={lessonIsFreeId}
															type="checkbox"
															checked={lessonFormData.isFree}
															onChange={(
																e: React.ChangeEvent<HTMLInputElement>,
															) => handleLessonIsFreeChange(e.target.checked)}
															className="h-4 w-4"
														/>
													</div>
												</div>
												{lessonFormData.type === "VIDEO" && (
													<div className="space-y-2">
														<label
															htmlFor={lessonVideoUrlId}
															className="text-sm font-medium"
														>
															Video URL
														</label>
														<Input
															id={lessonVideoUrlId}
															value={lessonFormData.videoUrl}
															onChange={(
																e: React.ChangeEvent<HTMLInputElement>,
															) => handleLessonVideoUrlChange(e.target.value)}
															placeholder="https://example.com/video.mp4"
														/>
													</div>
												)}
												<div className="space-y-2">
													<label
														htmlFor={lessonContentId}
														className="text-sm font-medium"
													>
														Content
													</label>
													<Textarea
														id={lessonContentId}
														value={lessonFormData.content}
														onChange={(
															e: React.ChangeEvent<HTMLTextAreaElement>,
														) => handleLessonContentChange(e.target.value)}
														placeholder="Enter lesson content"
														rows={4}
													/>
												</div>
												<div className="flex justify-end space-x-2">
													<Button
														variant="outline"
														onClick={() => {
															setShowCreateLesson(false);
															setSelectedSectionId(null);
														}}
													>
														Cancel
													</Button>
													<Button
														onClick={handleCreateLesson}
														disabled={!isLessonFormValid || isCreatingLesson}
													>
														{isCreatingLesson ? "Creating..." : "Create Lesson"}
													</Button>
												</div>
											</div>
										</div>
									)}

									{/* Lessons List */}
									{section.lessons.length === 0 ? (
										<div className="text-center text-muted-foreground py-8">
											<FileText className="mx-auto h-8 w-8 mb-2" />
											<p>No lessons in this section yet.</p>
										</div>
									) : (
										<div className="space-y-2">
											{section.lessons.map((lesson) => (
												<div
													key={lesson.id}
													className="flex items-center justify-between p-3 border rounded-lg"
												>
													<div className="flex items-center space-x-3">
														{lesson.type === "VIDEO" ? (
															<Video className="h-5 w-5 text-blue-500" />
														) : (
															<FileText className="h-5 w-5 text-green-500" />
														)}
														<div>
															<h4 className="font-medium">{lesson.title}</h4>
															<p className="text-sm text-muted-foreground">
																{lesson.type} • Order: {lesson.order}
																{lesson.isFree && " • Free Preview"}
															</p>
														</div>
													</div>
													<div className="flex items-center space-x-2">
														<Button
															size="sm"
															variant="outline"
															onClick={() =>
																navigate(`/dashboard/edit-lesson/${lesson.id}`)
															}
														>
															Edit
														</Button>
													</div>
												</div>
											))}
										</div>
									)}
								</Card>
							))}
						</div>
					)}
				</div>
			</div>
		</div>
	);
};
