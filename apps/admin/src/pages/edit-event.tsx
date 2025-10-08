import { DashboardLayout } from "../components/dashboard-layout";
import { EditCoursePage as EditCoursePageComponent } from "../features/courses/components/edit-course-page";

export const EditCoursePage = () => {
	return (
		<DashboardLayout>
			<EditCoursePageComponent />
		</DashboardLayout>
	);
};
