import { DashboardLayout } from "../components/dashboard-layout";
import { EditLessonPage as EditLessonPageComponent } from "../features/courses/components/edit-lesson-page";

export const EditLessonPage = () => {
	return (
		<DashboardLayout>
			<EditLessonPageComponent />
		</DashboardLayout>
	);
};
