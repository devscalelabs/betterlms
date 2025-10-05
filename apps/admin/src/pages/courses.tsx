import { Button, Card, Input } from "@betterlms/ui";
import { DashboardLayout } from "../components/dashboard-layout";

export const CoursesPage = () => {
	return (
		<DashboardLayout>
			<div className="space-y-6">
				<div className="flex items-center justify-between">
					<div>
						<h2 className="text-2xl font-bold text-gray-900">Courses</h2>
						<p className="text-sm text-gray-600 mt-1">
							Manage all courses and learning content
						</p>
					</div>
					<Button>Create Course</Button>
				</div>

				<Card className="p-6">
					<div className="mb-6 flex gap-4">
						<Input placeholder="Search courses..." className="max-w-sm" />
						<Button variant="outline">Filter</Button>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{[1, 2, 3, 4, 5, 6].map((i) => (
							<Card key={i} className="overflow-hidden">
								<div className="h-40 bg-gradient-to-br from-blue-500 to-purple-600" />
								<div className="p-4">
									<h3 className="text-lg font-semibold text-gray-900">
										Course Title {i}
									</h3>
									<p className="text-sm text-gray-600 mt-2 line-clamp-2">
										Learn the fundamentals and advanced concepts in this
										comprehensive course.
									</p>
									<div className="flex items-center justify-between mt-4">
										<div className="text-xs text-gray-500">
											<div>12 Lessons</div>
											<div className="mt-1">24 Students</div>
										</div>
										<div className="flex gap-2">
											<Button variant="outline" size="sm">
												Edit
											</Button>
											<Button variant="outline" size="sm">
												View
											</Button>
										</div>
									</div>
								</div>
							</Card>
						))}
					</div>
				</Card>
			</div>
		</DashboardLayout>
	);
};
