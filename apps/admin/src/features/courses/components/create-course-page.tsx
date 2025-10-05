import { Button, Card, Input, Textarea } from "@betterlms/ui";
import { ArrowLeft, Plus, X } from "lucide-react";
import { useId, useState } from "react";
import { useNavigate } from "react-router";
import { useCreateCourse } from "../hooks/use-create-course";

export const CreateCoursePage = () => {
	const navigate = useNavigate();
	const [newTag, setNewTag] = useState("");
	const titleId = useId();
	const slugId = useId();
	const descriptionId = useId();
	const thumbnailUrlId = useId();
	const categoryId = useId();
	const priceId = useId();
	const currencyId = useId();
	const isPublishedId = useId();
	const isPrivateId = useId();
	const tagsId = useId();

	const {
		formData,
		handleTitleChange,
		handleDescriptionChange,
		handleSlugChange,
		handleThumbnailUrlChange,
		handleIsPublishedChange,
		handleIsPrivateChange,
		handlePriceChange,
		handleCurrencyChange,
		handleTagsChange,
		handleCategoryChange,
		createCourse,
		isCreatingCourse,
		isFormValid,
		generateSlug,
	} = useCreateCourse({
		onSuccess: () => {
			navigate("/dashboard/courses");
		},
	});

	const handleTitleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const title = e.target.value;
		handleTitleChange(title);
		// Auto-generate slug if it's empty or matches the previous title
		if (!formData.slug || formData.slug === generateSlug(formData.title)) {
			handleSlugChange(generateSlug(title));
		}
	};

	const handleAddTag = () => {
		if (newTag.trim() && !formData.tags?.includes(newTag.trim())) {
			handleTagsChange([...(formData.tags || []), newTag.trim()]);
			setNewTag("");
		}
	};

	const handleRemoveTag = (tagToRemove: string) => {
		handleTagsChange(formData.tags?.filter((tag) => tag !== tagToRemove) || []);
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (isFormValid) {
			createCourse();
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
						<h1 className="text-3xl font-bold">Create New Course</h1>
						<p className="text-muted-foreground">
							Add a new course to your catalog
						</p>
					</div>
				</div>

				<Card className="p-6">
					<div className="mb-6">
						<h2 className="text-xl font-semibold">Course Details</h2>
					</div>
					<div>
						<form onSubmit={handleSubmit} className="space-y-6">
							<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
								<div className="space-y-2">
									<label htmlFor={titleId} className="text-sm font-medium">
										Title *
									</label>
									<Input
										id={titleId}
										value={formData.title}
										onChange={handleTitleInputChange}
										placeholder="Enter course title"
										required
									/>
								</div>

								<div className="space-y-2">
									<label htmlFor={slugId} className="text-sm font-medium">
										Slug *
									</label>
									<Input
										id={slugId}
										value={formData.slug}
										onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
											handleSlugChange(e.target.value)
										}
										placeholder="course-slug"
										required
									/>
								</div>
							</div>

							<div className="space-y-2">
								<label htmlFor={descriptionId} className="text-sm font-medium">
									Description
								</label>
								<Textarea
									id={descriptionId}
									value={formData.description || ""}
									onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
										handleDescriptionChange(e.target.value)
									}
									placeholder="Enter course description"
									rows={4}
								/>
							</div>

							<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
								<div className="space-y-2">
									<label
										htmlFor={thumbnailUrlId}
										className="text-sm font-medium"
									>
										Thumbnail URL
									</label>
									<Input
										id={thumbnailUrlId}
										value={formData.thumbnailUrl || ""}
										onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
											handleThumbnailUrlChange(e.target.value)
										}
										placeholder="https://example.com/thumbnail.jpg"
									/>
								</div>

								<div className="space-y-2">
									<label htmlFor={categoryId} className="text-sm font-medium">
										Category
									</label>
									<Input
										id={categoryId}
										value={formData.category || ""}
										onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
											handleCategoryChange(e.target.value)
										}
										placeholder="e.g., Programming, Design, Business"
									/>
								</div>
							</div>

							<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
								<div className="space-y-2">
									<label htmlFor={priceId} className="text-sm font-medium">
										Price
									</label>
									<Input
										id={priceId}
										type="number"
										min="0"
										step="0.01"
										value={formData.price || ""}
										onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
											handlePriceChange(Number(e.target.value))
										}
										placeholder="0.00"
									/>
								</div>
								<div className="space-y-2">
									<label htmlFor={currencyId} className="text-sm font-medium">
										Currency
									</label>
									<Input
										id={currencyId}
										value={formData.currency}
										onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
											handleCurrencyChange(e.target.value)
										}
										placeholder="USD"
										maxLength={3}
									/>
								</div>
							</div>

							<div className="space-y-2">
								<label htmlFor={tagsId} className="text-sm font-medium">
									Tags
								</label>
								<div className="flex gap-2">
									<Input
										id={tagsId}
										value={newTag}
										onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
											setNewTag(e.target.value)
										}
										placeholder="Add a tag"
										onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) => {
											if (e.key === "Enter") {
												e.preventDefault();
												handleAddTag();
											}
										}}
									/>
									<Button type="button" onClick={handleAddTag} size="sm">
										<Plus className="h-4 w-4" />
									</Button>
								</div>
								{formData.tags && formData.tags.length > 0 && (
									<div className="flex flex-wrap gap-2 mt-2">
										{formData.tags.map((tag) => (
											<span
												key={tag}
												className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full"
											>
												{tag}
												<X
													className="h-3 w-3 cursor-pointer"
													onClick={() => handleRemoveTag(tag)}
												/>
											</span>
										))}
									</div>
								)}
							</div>

							<div className="flex items-center space-x-6">
								<div className="flex items-center space-x-2">
									<input
										type="checkbox"
										id={isPublishedId}
										checked={formData.isPublished}
										onChange={(e) => handleIsPublishedChange(e.target.checked)}
										className="h-4 w-4"
									/>
									<label
										htmlFor={isPublishedId}
										className="text-sm font-medium"
									>
										Published
									</label>
								</div>
								<div className="flex items-center space-x-2">
									<input
										type="checkbox"
										id={isPrivateId}
										checked={formData.isPrivate}
										onChange={(e) => handleIsPrivateChange(e.target.checked)}
										className="h-4 w-4"
									/>
									<label htmlFor={isPrivateId} className="text-sm font-medium">
										Private
									</label>
								</div>
							</div>

							<div className="flex justify-end space-x-2 pt-6 border-t">
								<Button
									type="button"
									variant="outline"
									onClick={() => navigate("/dashboard/courses")}
								>
									Cancel
								</Button>
								<Button
									type="submit"
									disabled={!isFormValid || isCreatingCourse}
								>
									{isCreatingCourse ? "Creating..." : "Create Course"}
								</Button>
							</div>
						</form>
					</div>
				</Card>
			</div>
		</div>
	);
};
