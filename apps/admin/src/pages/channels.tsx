import { DashboardLayout } from "../components/dashboard-layout";
import { ChannelsManagement } from "../features/channels/components/channels-management";

export const ChannelsPage = () => {
	return (
		<DashboardLayout>
			<ChannelsManagement />
		</DashboardLayout>
	);
};
