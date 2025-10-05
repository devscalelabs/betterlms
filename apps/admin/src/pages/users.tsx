import { getUserInitials } from "@betterlms/common/strings";
import {
	Avatar,
	AvatarFallback,
	AvatarImage,
	Button,
	Card,
	Input,
} from "@betterlms/ui";
import { useState } from "react";
import { DashboardLayout } from "../components/dashboard-layout";
import { useProfiles } from "../features/profiles/hooks/use-profiles";
import { useSuspendUser } from "../features/profiles/hooks/use-suspend-user";
import { useUnsuspendUser } from "../features/profiles/hooks/use-unsuspend-user";

export const UsersPage = () => {
	const { profiles, isProfilesLoading } = useProfiles();
	const { suspendUser, isSuspending } = useSuspendUser();
	const { unsuspendUser, isUnsuspending } = useUnsuspendUser();
	const [searchQuery, setSearchQuery] = useState("");

	const filteredProfiles = profiles.filter(
		(profile) =>
			profile.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
			profile.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
			profile.username.toLowerCase().includes(searchQuery.toLowerCase()),
	);

	return (
		<DashboardLayout>
			<div className="space-y-6">
				<div className="flex items-center justify-between">
					<div>
						<h2 className="text-2xl font-bold text-gray-900">Users</h2>
						<p className="text-sm text-gray-600 mt-1">
							Manage all users in the platform ({profiles.length} total)
						</p>
					</div>
					<Button>Add New User</Button>
				</div>

				<Card className="p-6">
					<div className="mb-4">
						<Input
							placeholder="Search users..."
							className="max-w-sm"
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
						/>
					</div>

					{isProfilesLoading ? (
						<div className="flex items-center justify-center py-12">
							<div className="text-center">
								<div className="w-8 h-8 border-4 border-gray-300 border-t-gray-900 rounded-full animate-spin mx-auto" />
								<p className="text-sm text-gray-600 mt-4">Loading users...</p>
							</div>
						</div>
					) : filteredProfiles.length === 0 ? (
						<div className="text-center py-12">
							<p className="text-sm text-gray-600">
								{searchQuery
									? "No users found matching your search"
									: "No users yet"}
							</p>
						</div>
					) : (
						<div className="overflow-x-auto">
							<table className="w-full">
								<thead>
									<tr className="border-b border-gray-200">
										<th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">
											Name
										</th>
										<th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">
											Username
										</th>
										<th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">
											Email
										</th>
										<th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">
											Role
										</th>
										<th className="text-right py-3 px-4 text-sm font-semibold text-gray-900">
											Actions
										</th>
									</tr>
								</thead>
								<tbody>
									{filteredProfiles.map((profile) => (
										<tr key={profile.id} className="border-b border-gray-100">
											<td className="py-3 px-4">
												<div className="flex items-center gap-3">
													<Avatar className="size-10">
														<AvatarImage
															src={profile.imageUrl}
															alt={profile.name}
														/>
														<AvatarFallback>
															{getUserInitials(profile.name)}
														</AvatarFallback>
													</Avatar>
													<span className="text-sm font-medium text-gray-900">
														{profile.name}
													</span>
												</div>
											</td>
											<td className="py-3 px-4 text-sm text-gray-600">
												@{profile.username}
											</td>
											<td className="py-3 px-4 text-sm text-gray-600">
												{profile.email}
											</td>
											<td className="py-3 px-4">
												<div className="flex items-center gap-2">
													<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize">
														{profile.role}
													</span>
													{profile.isSuspended && (
														<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
															Suspended
														</span>
													)}
												</div>
											</td>
											<td className="py-3 px-4 text-right space-x-2">
												<Button
													variant="outline"
													size="sm"
													onClick={() => {
														if (profile.isSuspended) {
															unsuspendUser(profile.username);
														} else {
															suspendUser(profile.username);
														}
													}}
													disabled={isSuspending || isUnsuspending}
												>
													{profile.isSuspended ? "Unsuspend" : "Suspend"}
												</Button>
												<Button variant="outline" size="sm">
													Delete
												</Button>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					)}
				</Card>
			</div>
		</DashboardLayout>
	);
};
