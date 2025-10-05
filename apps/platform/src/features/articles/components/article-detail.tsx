import { useArticle } from "../hooks/use-article";
import { ArticleCard } from "./article-card";

interface ArticleDetailProps {
	articleId: string;
}

export const ArticleDetail = ({ articleId }: ArticleDetailProps) => {
	const { data: article, isLoading, error } = useArticle(articleId);

	if (isLoading) {
		return (
			<div className="border-b border-border p-4">
				<div className="flex gap-3">
					<div className="size-10 bg-muted rounded-full animate-pulse" />
					<div className="flex-1 space-y-2">
						<div className="h-4 bg-muted rounded animate-pulse" />
						<div className="h-6 bg-muted rounded animate-pulse w-3/4" />
						<div className="h-4 bg-muted rounded animate-pulse w-1/2" />
						<div className="space-y-2 mt-4">
							<div className="h-4 bg-muted rounded animate-pulse" />
							<div className="h-4 bg-muted rounded animate-pulse" />
							<div className="h-4 bg-muted rounded animate-pulse w-3/4" />
						</div>
					</div>
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="text-center py-8">
				<p className="text-muted-foreground">Failed to load article</p>
			</div>
		);
	}

	if (!article) {
		return (
			<div className="text-center py-8">
				<p className="text-muted-foreground">Article not found</p>
			</div>
		);
	}

	return <ArticleCard article={article} isDetailView />;
};
