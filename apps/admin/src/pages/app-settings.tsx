import { DashboardLayout } from "../components/dashboard-layout";
import { AppSettingsPage } from "../features/app-settings/components/app-settings-page";

export const AppSettingsPageWrapper = () => {
	return (
		<DashboardLayout>
			<AppSettingsPage />
		</DashboardLayout>
	);
};
