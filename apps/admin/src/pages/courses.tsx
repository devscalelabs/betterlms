import { DashboardLayout } from "../components/dashboard-layout";
import { CoursesPage as CoursesPageComponent } from "../features/courses/components/courses-page";

export const CoursesPage = () => {
	return (
		<DashboardLayout>
			<CoursesPageComponent />
		</DashboardLayout>
	);
};
