import { getUserInitials } from "@betterlms/common/strings";
import { Avatar, AvatarFallback, AvatarImage } from "@betterlms/ui";
import { useNavigate } from "react-router";
import type { Course } from "../types";

interface CourseCardProps {
	course: Course;
}

export const CourseCard = ({ course }: CourseCardProps) => {
	const navigate = useNavigate();

	const handleCardClick = () => {
		navigate(`/courses/${course.slug}`);
	};

	const formatPrice = (price: number | null, currency: string) => {
		if (!price) return "Free";
		return new Intl.NumberFormat("en-US", {
			style: "currency",
			currency: currency,
		}).format(price);
	};

	const getTotalLessons = () => {
		return course.sections.reduce(
			(total, section) => total + section.lessons.length,
			0,
		);
	};

	const getTotalDuration = () => {
		// This would need to be calculated from actual video durations
		// For now, we'll show an estimate based on lesson count
		const lessonCount = getTotalLessons();
		const estimatedMinutes = lessonCount * 10; // Rough estimate: 10 minutes per lesson

		if (estimatedMinutes < 60) {
			return `${estimatedMinutes}m`;
		}

		const hours = Math.floor(estimatedMinutes / 60);
		const minutes = estimatedMinutes % 60;
		return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
	};

	return (
		<button
			type="button"
			className="border border-border rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer w-full text-left p-0"
			onClick={handleCardClick}
		>
			{/* Thumbnail */}
			<div className="bg-muted relative">
				{course.thumbnailUrl ? (
					<img
						src={course.thumbnailUrl}
						alt={course.title}
						className="w-full h-full object-cover"
					/>
				) : (
					<div className="w-full h-64 flex items-center justify-center">
						<div className="text-4xl text-muted-foreground">📚</div>
					</div>
				)}
				{!course.isPublished && (
					<span className="absolute top-2 left-2 bg-secondary text-secondary-foreground px-2 py-1 rounded-md text-xs font-medium">
						Draft
					</span>
				)}
			</div>

			{/* Content */}
			<div className="p-4">
				{/* Category */}
				{course.category && (
					<span className="inline-block bg-muted text-muted-foreground px-2 py-1 rounded-md text-xs font-medium mb-2 border">
						{course.category}
					</span>
				)}

				{/* Title */}
				<h3 className="font-semibold text-lg mb-2 line-clamp-2">
					{course.title}
				</h3>

				{/* Description */}
				{course.description && (
					<p className="text-sm text-muted-foreground mb-3 line-clamp-2">
						{course.description}
					</p>
				)}

				{/* Instructor */}
				<div className="flex items-center gap-2 mb-3">
					<Avatar className="size-6">
						<AvatarImage
							src={course.instructor.imageUrl || ""}
							alt={course.instructor.name}
						/>
						<AvatarFallback className="text-xs">
							{getUserInitials(course.instructor.name)}
						</AvatarFallback>
					</Avatar>
					<span className="text-sm text-muted-foreground">
						{course.instructor.name}
					</span>
				</div>

				{/* Course Stats */}
				<div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
					<div className="flex items-center gap-4">
						<span>{getTotalLessons()} lessons</span>
						<span>{getTotalDuration()}</span>
						<span>{course._count.enrollments} students</span>
					</div>
				</div>

				{/* Tags */}
				{course.tags.length > 0 && (
					<div className="flex flex-wrap gap-1 mb-4">
						{course.tags.slice(0, 3).map((tag) => (
							<span
								key={tag}
								className="bg-secondary text-secondary-foreground px-2 py-1 rounded-md text-xs"
							>
								{tag}
							</span>
						))}
						{course.tags.length > 3 && (
							<span className="bg-secondary text-secondary-foreground px-2 py-1 rounded-md text-xs">
								+{course.tags.length - 3}
							</span>
						)}
					</div>
				)}

				{/* Price and Action */}
				<div className="flex items-center justify-between">
					<span className="font-semibold text-lg">
						{formatPrice(course.price, course.currency)}
					</span>
				</div>
			</div>
		</button>
	);
};
