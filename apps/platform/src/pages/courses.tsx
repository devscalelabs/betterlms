import { HeadingBox } from "@/components/shared/heading-box";
import { CourseList } from "@/features/courses/components/course-list";

export const CoursesPage = () => {
	return (
		<main>
			<HeadingBox>
				<div>Courses</div>
				<div></div>
			</HeadingBox>
			<CourseList isPublished={true} />
		</main>
	);
};
