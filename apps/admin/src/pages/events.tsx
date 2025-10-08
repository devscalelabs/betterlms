import { DashboardLayout } from "../components/dashboard-layout";
import { EventsPage as EventsPageComponent } from "../features/events/components/events-page";

export const EventsPage = () => {
	return (
		<DashboardLayout>
			<EventsPageComponent />
		</DashboardLayout>
	);
};
