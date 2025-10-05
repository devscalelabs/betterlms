import { Card } from "@betterlms/ui";
import { DashboardLayout } from "../components/dashboard-layout";

export const DashboardPage = () => {
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
								<p className="text-3xl font-bold text-gray-900 mt-2">2,543</p>
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
							Recent Activity
						</h3>
						<div className="space-y-4">
							{[
								{
									id: "act-1",
									action: "New user registered",
									user: "John Doe",
									time: "2 minutes ago",
								},
								{
									id: "act-2",
									action: "Article published",
									user: "Jane Smith",
									time: "15 minutes ago",
								},
								{
									id: "act-3",
									action: "Course updated",
									user: "Mike Johnson",
									time: "1 hour ago",
								},
								{
									id: "act-4",
									action: "New enrollment",
									user: "Sarah Williams",
									time: "2 hours ago",
								},
								{
									id: "act-5",
									action: "Article draft saved",
									user: "Tom Brown",
									time: "3 hours ago",
								},
							].map((activity) => (
								<div
									key={activity.id}
									className="flex items-start justify-between py-3 border-b border-gray-100 last:border-0"
								>
									<div>
										<p className="text-sm font-medium text-gray-900">
											{activity.action}
										</p>
										<p className="text-xs text-gray-600 mt-1">
											by {activity.user}
										</p>
									</div>
									<span className="text-xs text-gray-500">{activity.time}</span>
								</div>
							))}
						</div>
					</Card>

					<Card className="p-6">
						<h3 className="text-lg font-semibold text-gray-900 mb-4">
							Popular Courses
						</h3>
						<div className="space-y-4">
							{[
								{
									id: "course-1",
									title: "React Fundamentals",
									enrollments: 234,
									rating: 4.8,
								},
								{
									id: "course-2",
									title: "Advanced TypeScript",
									enrollments: 189,
									rating: 4.9,
								},
								{
									id: "course-3",
									title: "Node.js Mastery",
									enrollments: 156,
									rating: 4.7,
								},
								{
									id: "course-4",
									title: "UI/UX Design Basics",
									enrollments: 142,
									rating: 4.6,
								},
								{
									id: "course-5",
									title: "Database Design",
									enrollments: 128,
									rating: 4.8,
								},
							].map((course) => (
								<div
									key={course.id}
									className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0"
								>
									<div className="flex-1">
										<p className="text-sm font-medium text-gray-900">
											{course.title}
										</p>
										<p className="text-xs text-gray-600 mt-1">
											{course.enrollments} enrollments
										</p>
									</div>
									<div className="flex items-center gap-1">
										<svg
											className="w-4 h-4 text-yellow-500"
											fill="currentColor"
											viewBox="0 0 20 20"
											aria-label="Star rating"
										>
											<title>Star</title>
											<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
										</svg>
										<span className="text-sm font-medium text-gray-900">
											{course.rating}
										</span>
									</div>
								</div>
							))}
						</div>
					</Card>
				</div>
			</div>
		</DashboardLayout>
	);
};
