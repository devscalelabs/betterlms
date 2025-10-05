import { DashboardLayout } from "../components/dashboard-layout";
import { CreateCoursePage as CreateCoursePageComponent } from "../features/courses/components/create-course-page";

export const CreateCoursePage = () => {
	return (
		<DashboardLayout>
			<CreateCoursePageComponent />
		</DashboardLayout>
	);
};
