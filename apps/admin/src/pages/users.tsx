import { Card } from "@betterlms/ui";
import { DashboardLayout } from "../components/dashboard-layout";
import { UsersTable } from "../features/profiles/components/users-table";
import { useProfiles } from "../features/profiles/hooks/use-profiles";
import { useSuspendUser } from "../features/profiles/hooks/use-suspend-user";
import { useUnsuspendUser } from "../features/profiles/hooks/use-unsuspend-user";

export const UsersPage = () => {
	const { profiles, isProfilesLoading } = useProfiles();
	const { suspendUser, isSuspending } = useSuspendUser();
	const { unsuspendUser, isUnsuspending } = useUnsuspendUser();

	return (
		<DashboardLayout>
			<div className="space-y-6">
				<div className="flex items-center">
					<div>
						<h2 className="text-2xl font-bold text-gray-900">Users</h2>
						<p className="text-sm text-gray-600 mt-1">
							Manage all users in the platform ({profiles.length} total)
						</p>
					</div>
				</div>

				<Card className="p-6">
					<UsersTable
						profiles={profiles}
						isProfilesLoading={isProfilesLoading}
						onSuspendUser={suspendUser}
						onUnsuspendUser={unsuspendUser}
						isSuspending={isSuspending}
						isUnsuspending={isUnsuspending}
					/>
				</Card>
			</div>
		</DashboardLayout>
	);
};
