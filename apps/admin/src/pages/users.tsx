import { Button, Card, Input } from "@betterlms/ui";
import { DashboardLayout } from "../components/dashboard-layout";

export const UsersPage = () => {
	return (
		<DashboardLayout>
			<div className="space-y-6">
				<div className="flex items-center justify-between">
					<div>
						<h2 className="text-2xl font-bold text-gray-900">Users</h2>
						<p className="text-sm text-gray-600 mt-1">
							Manage all users in the platform
						</p>
					</div>
					<Button>Add New User</Button>
				</div>

				<Card className="p-6">
					<div className="mb-4">
						<Input placeholder="Search users..." className="max-w-sm" />
					</div>

					<div className="overflow-x-auto">
						<table className="w-full">
							<thead>
								<tr className="border-b border-gray-200">
									<th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">
										Name
									</th>
									<th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">
										Email
									</th>
									<th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">
										Role
									</th>
									<th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">
										Status
									</th>
									<th className="text-right py-3 px-4 text-sm font-semibold text-gray-900">
										Actions
									</th>
								</tr>
							</thead>
							<tbody>
								{[1, 2, 3, 4, 5].map((i) => (
									<tr key={i} className="border-b border-gray-100">
										<td className="py-3 px-4 text-sm text-gray-900">
											User {i}
										</td>
										<td className="py-3 px-4 text-sm text-gray-600">
											user{i}@example.com
										</td>
										<td className="py-3 px-4 text-sm text-gray-600">Member</td>
										<td className="py-3 px-4">
											<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
												Active
											</span>
										</td>
										<td className="py-3 px-4 text-right space-x-2">
											<Button variant="outline" size="sm">
												Edit
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
				</Card>
			</div>
		</DashboardLayout>
	);
};
