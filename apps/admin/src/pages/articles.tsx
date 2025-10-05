import { Button, Card, Input } from "@betterlms/ui";
import { DashboardLayout } from "../components/dashboard-layout";

export const ArticlesPage = () => {
	return (
		<DashboardLayout>
			<div className="space-y-6">
				<div className="flex items-center justify-between">
					<div>
						<h2 className="text-2xl font-bold text-gray-900">Articles</h2>
						<p className="text-sm text-gray-600 mt-1">
							Manage all articles and content
						</p>
					</div>
					<Button>Create Article</Button>
				</div>

				<Card className="p-6">
					<div className="mb-4 flex gap-4">
						<Input placeholder="Search articles..." className="max-w-sm" />
						<Button variant="outline">Filter</Button>
					</div>

					<div className="space-y-4">
						{[1, 2, 3, 4, 5].map((i) => (
							<div
								key={i}
								className="flex items-start justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
							>
								<div className="flex-1">
									<h3 className="text-lg font-semibold text-gray-900">
										Article Title {i}
									</h3>
									<p className="text-sm text-gray-600 mt-1">
										This is a sample article description that provides an
										overview of the content...
									</p>
									<div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
										<span>By Author {i}</span>
										<span>•</span>
										<span>Published 2 days ago</span>
										<span>•</span>
										<span className="inline-flex items-center px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
											Published
										</span>
									</div>
								</div>
								<div className="flex gap-2 ml-4">
									<Button variant="outline" size="sm">
										Edit
									</Button>
									<Button variant="outline" size="sm">
										Delete
									</Button>
								</div>
							</div>
						))}
					</div>
				</Card>
			</div>
		</DashboardLayout>
	);
};
