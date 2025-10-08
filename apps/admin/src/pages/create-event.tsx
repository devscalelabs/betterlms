import { DashboardLayout } from "../components/dashboard-layout";
import { CreateEventPage as CreateEventPageComponent } from "../features/events/components/create-event-page";

export const CreateEventPage = () => {
	return (
		<DashboardLayout>
			<CreateEventPageComponent />
		</DashboardLayout>
	);
};
