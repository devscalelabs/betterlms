import { DashboardLayout } from "../components/dashboard-layout";
import { EditEventPage as EditEventPageComponent } from "../features/events/components/edit-event-page";

export const EditEventPage = () => {
  return (
    <DashboardLayout>
      <EditEventPageComponent />
    </DashboardLayout>
  );
};
