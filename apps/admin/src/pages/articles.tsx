import { Button, Card, Input } from "@betterlms/ui";
import { useNavigate } from "react-router";
import { DashboardLayout } from "../components/dashboard-layout";
import { useArticles } from "../features/articles/hooks/use-articles";

export const ArticlesPage = () => {
	const navigate = useNavigate();
	const { articles, isLoading, deleteArticle, isDeletingArticle } =
		useArticles();

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
					<Button onClick={() => navigate("/dashboard/articles/create")}>
						Create Article
					</Button>
				</div>

				<Card className="p-6">
					<div className="mb-4 flex gap-4">
						<Input placeholder="Search articles..." className="max-w-sm" />
						<Button variant="outline">Filter</Button>
					</div>

					<div className="space-y-4">
						{isLoading ? (
							<div className="flex items-center justify-center py-8">
								<div className="text-sm text-gray-500">Loading articles...</div>
							</div>
						) : articles.length === 0 ? (
							<div className="flex items-center justify-center py-8">
								<div className="text-sm text-gray-500">No articles found</div>
							</div>
						) : (
							articles.map((article) => (
								<div
									key={article.id}
									className="flex items-start justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
								>
									<div className="flex-1">
										<h3 className="text-lg font-semibold text-gray-900">
											{article.title || "Untitled Article"}
										</h3>
										<p className="text-sm text-gray-600 mt-1 line-clamp-2">
											{article.content}
										</p>
										<div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
											<span>By {article.user?.name || "Unknown Author"}</span>
											<span>•</span>
											<span>
												{new Date(article.createdAt).toLocaleDateString()}
											</span>
											<span>•</span>
											<span className="inline-flex items-center px-2 py-0.5 rounded-full bg-green-100 text-green-800">
												{article.isDeleted ? "Deleted" : "Published"}
											</span>
											{article.channel && (
												<>
													<span>•</span>
													<span className="inline-flex items-center px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
														{article.channel.name}
													</span>
												</>
											)}
										</div>
									</div>
									<div className="flex gap-2 ml-4">
										<Button
											variant="outline"
											size="sm"
											onClick={() =>
												navigate(`/dashboard/articles/edit/${article.id}`)
											}
										>
											Edit
										</Button>
										<Button
											variant="outline"
											size="sm"
											onClick={() => deleteArticle(article.id)}
											disabled={isDeletingArticle}
										>
											{isDeletingArticle ? "Deleting..." : "Delete"}
										</Button>
									</div>
								</div>
							))
						)}
					</div>
				</Card>
			</div>
		</DashboardLayout>
	);
};
