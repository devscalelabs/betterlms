import { Button, Card } from "@betterlms/ui";
import { Calendar, Plus, Users } from "lucide-react";
import { useNavigate } from "react-router";
import { useCourses } from "../hooks/use-courses";

interface CoursesListProps {
	onCreateCourse?: () => void;
}

export const CoursesList = ({ onCreateCourse }: CoursesListProps) => {
	const navigate = useNavigate();
	const { courses, isCoursesLoading } = useCourses();

	const handleCreateCourse = () => {
		if (onCreateCourse) {
			onCreateCourse();
		} else {
			navigate("/dashboard/courses/create");
		}
	};

	if (isCoursesLoading) {
		return (
			<div className="flex items-center justify-center h-64">
				<div className="text-muted-foreground">Loading courses...</div>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold">Courses</h1>
					<p className="text-muted-foreground">Manage your course catalog</p>
				</div>
				<Button onClick={handleCreateCourse}>
					<Plus className="mr-2 h-4 w-4" />
					Create Course
				</Button>
			</div>

			{courses.length === 0 ? (
				<Card className="p-6">
					<div className="flex flex-col items-center justify-center py-12">
						<div className="text-muted-foreground text-center">
							<h3 className="text-lg font-semibold mb-2">No courses yet</h3>
							<p className="mb-4">Get started by creating your first course</p>
							<Button onClick={handleCreateCourse}>
								<Plus className="mr-2 h-4 w-4" />
								Create Course
							</Button>
						</div>
					</div>
				</Card>
			) : (
				<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
					{courses.map((course) => (
						<Card
							key={course.id}
							className="hover:shadow-md transition-shadow p-6 cursor-pointer"
							onClick={() => navigate(`/dashboard/courses/${course.id}/edit`)}
						>
							<div className="mb-4">
								<div className="flex items-start justify-between">
									<h3 className="text-lg font-semibold line-clamp-2">
										{course.title}
									</h3>
									<div className="flex gap-1">
										{course.isPublished ? (
											<span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
												Published
											</span>
										) : (
											<span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">
												Draft
											</span>
										)}
										{course.isPrivate && (
											<span className="px-2 py-1 border border-gray-300 text-gray-700 text-xs rounded-full">
												Private
											</span>
										)}
									</div>
								</div>
								{course.description && (
									<p className="text-sm text-muted-foreground line-clamp-2">
										{course.description}
									</p>
								)}
							</div>
							<div>
								<div className="space-y-3">
									<div className="flex items-center text-sm text-muted-foreground">
										<Users className="mr-2 h-4 w-4" />
										{course._count.enrollments} enrollments
									</div>
									<div className="flex items-center text-sm text-muted-foreground">
										<Calendar className="mr-2 h-4 w-4" />
										{new Date(course.createdAt).toLocaleDateString()}
									</div>
									{course.price && course.price > 0 && (
										<div className="text-sm font-medium">
											{course.currency} {course.price}
										</div>
									)}
									{course.tags.length > 0 && (
										<div className="flex flex-wrap gap-1">
											{course.tags.slice(0, 3).map((tag) => (
												<span
													key={tag}
													className="px-2 py-1 border border-gray-300 text-gray-700 text-xs rounded-full"
												>
													{tag}
												</span>
											))}
											{course.tags.length > 3 && (
												<span className="px-2 py-1 border border-gray-300 text-gray-700 text-xs rounded-full">
													+{course.tags.length - 3} more
												</span>
											)}
										</div>
									)}
									<div className="text-sm text-muted-foreground">
										Instructor: {course.instructor.name}
									</div>
								</div>
							</div>
						</Card>
					))}
				</div>
			)}
		</div>
	);
};
