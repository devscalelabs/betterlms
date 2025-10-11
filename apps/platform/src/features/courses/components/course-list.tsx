import { Video } from "lucide-react";
import { useCourses } from "../hooks/use-courses";
import { CourseCard } from "./course-card";
import {
	Empty,
	EmptyHeader,
	EmptyDescription,
	EmptyMedia,
	EmptyTitle,
} from "@betterlms/ui";

interface CourseListProps {
	instructorId?: string;
	category?: string;
	isPublished?: boolean;
}

export const CourseList = ({
	instructorId,
	category,
	isPublished,
}: CourseListProps) => {
	const filters: Parameters<typeof useCourses>[0] = {};
	if (instructorId) filters.instructorId = instructorId;
	if (category) filters.category = category;
	if (isPublished !== undefined) filters.isPublished = isPublished;

	const { courses, isLoadingCourses } = useCourses(filters);

	if (isLoadingCourses) {
		return (
			<div className="grid grid-cols-1 gap-6">
				{[1, 2, 3, 4, 5, 6].map((i) => (
					<div
						key={i}
						className="border border-border rounded-lg overflow-hidden animate-pulse"
					>
						<div className="aspect-video bg-muted" />
						<div className="p-4 space-y-3">
							<div className="h-4 bg-muted rounded w-1/4" />
							<div className="h-6 bg-muted rounded w-3/4" />
							<div className="h-4 bg-muted rounded w-full" />
							<div className="h-4 bg-muted rounded w-2/3" />
							<div className="flex items-center gap-2">
								<div className="size-6 bg-muted rounded-full" />
								<div className="h-4 bg-muted rounded w-24" />
							</div>
							<div className="flex justify-between items-center">
								<div className="h-5 bg-muted rounded w-16" />
								<div className="h-8 bg-muted rounded w-20" />
							</div>
						</div>
					</div>
				))}
			</div>
		);
	}

	return (
		<>
			<div className="grid grid-cols-1 gap-6 p-6">
				{courses.map((course) => (
					<CourseCard key={course.id} course={course} />
				))}
			</div>

			{courses.length === 0 && (
				<Empty>
					<EmptyHeader>
						<EmptyMedia variant="icon">
							<Video />
						</EmptyMedia>
						<EmptyTitle>No Notification</EmptyTitle>
						<EmptyDescription>
							All notifications have been would shown here.
						</EmptyDescription>
					</EmptyHeader>
				</Empty>
			)}
		</>
	);
};
