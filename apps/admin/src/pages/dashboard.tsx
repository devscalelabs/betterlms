import { Card } from "@betterlms/ui";
import { DashboardLayout } from "../components/dashboard-layout";
import { useChannels } from "../features/channels/hooks/use-channels";
import { useProfiles } from "../features/profiles/hooks/use-profiles";

export const DashboardPage = () => {
	const { channels, isLoadingChannels } = useChannels();
	const { profiles, isProfilesLoading } = useProfiles();

	return (
		<DashboardLayout>
			<div className="space-y-6">
				<div>
					<h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
					<p className="text-sm text-gray-600 mt-1">
						Overview of your platform statistics
					</p>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
					<Card className="p-6">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm font-medium text-gray-600">Total Users</p>
								<p className="text-3xl font-bold text-gray-900 mt-2">
									{isProfilesLoading ? "-" : profiles.length}
								</p>
								<p className="text-xs text-green-600 mt-2">
									+12% from last month
								</p>
							</div>
							<div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
								<svg
									className="w-6 h-6 text-blue-600"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
									aria-label="Users icon"
								>
									<title>Users</title>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
									/>
								</svg>
							</div>
						</div>
					</Card>

					<Card className="p-6">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm font-medium text-gray-600">
									Total Articles
								</p>
								<p className="text-3xl font-bold text-gray-900 mt-2">142</p>
								<p className="text-xs text-green-600 mt-2">
									+8% from last month
								</p>
							</div>
							<div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
								<svg
									className="w-6 h-6 text-purple-600"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
									aria-label="Articles icon"
								>
									<title>Articles</title>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
									/>
								</svg>
							</div>
						</div>
					</Card>

					<Card className="p-6">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm font-medium text-gray-600">
									Total Courses
								</p>
								<p className="text-3xl font-bold text-gray-900 mt-2">38</p>
								<p className="text-xs text-green-600 mt-2">
									+5% from last month
								</p>
							</div>
							<div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
								<svg
									className="w-6 h-6 text-green-600"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
									aria-label="Courses icon"
								>
									<title>Courses</title>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
									/>
								</svg>
							</div>
						</div>
					</Card>

					<Card className="p-6">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm font-medium text-gray-600">
									Active Sessions
								</p>
								<p className="text-3xl font-bold text-gray-900 mt-2">834</p>
								<p className="text-xs text-green-600 mt-2">
									+18% from last month
								</p>
							</div>
							<div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
								<svg
									className="w-6 h-6 text-orange-600"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
									aria-label="Sessions icon"
								>
									<title>Sessions</title>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M13 10V3L4 14h7v7l9-11h-7z"
									/>
								</svg>
							</div>
						</div>
					</Card>
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
					<Card className="p-6">
						<h3 className="text-lg font-semibold text-gray-900 mb-4">
							Channels
						</h3>
						<div className="space-y-2">
							{isLoadingChannels ? (
								<div className="text-sm text-gray-600">Loading channels...</div>
							) : channels.length === 0 ? (
								<div className="text-sm text-gray-600">No channels found</div>
							) : (
								channels.map((channel) => (
									<div
										key={channel.id}
										className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
									>
										<p className="text-sm font-medium text-gray-900">
											{channel.name}
										</p>
										<span className="text-xs text-gray-600">
											{channel.isPrivate ? "Private" : "Public"}
										</span>
									</div>
								))
							)}
						</div>
					</Card>

					<Card className="p-6">
						<h3 className="text-lg font-semibold text-gray-900 mb-4">Users</h3>
						<div className="space-y-2">
							{isProfilesLoading ? (
								<div className="text-sm text-gray-600">Loading users...</div>
							) : profiles.length === 0 ? (
								<div className="text-sm text-gray-600">No users found</div>
							) : (
								profiles.map((user) => (
									<div
										key={user.id}
										className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
									>
										<p className="text-sm font-medium text-gray-900">
											{user.name}
										</p>
										<span className="text-xs text-gray-600">
											@{user.username}
										</span>
									</div>
								))
							)}
						</div>
					</Card>
				</div>
			</div>
		</DashboardLayout>
	);
};
