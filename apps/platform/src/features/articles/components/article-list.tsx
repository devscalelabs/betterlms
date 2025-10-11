import { useArticles } from "../hooks/use-articles";
import { ArticleCard } from "./article-card";
import {
	Empty,
	EmptyHeader,
	EmptyDescription,
	EmptyMedia,
	EmptyTitle,
} from "@betterlms/ui";
import { FileText } from "lucide-react";

interface ArticleListProps {
	username?: string;
	channelSlug?: string;
}

export const ArticleList = ({ username, channelSlug }: ArticleListProps) => {
	const {
		data: articles,
		isLoading,
		error,
	} = useArticles({
		...(username && { username }),
		...(channelSlug && { channelSlug }),
	});

	if (isLoading) {
		return (
			<div className="space-y-4">
				{[1, 2, 3].map((i) => (
					<div key={i} className="border-b border-border p-4">
						<div className="flex gap-3">
							<div className="size-10 bg-muted rounded-full animate-pulse" />
							<div className="flex-1 space-y-2">
								<div className="h-4 bg-muted rounded animate-pulse" />
								<div className="h-4 bg-muted rounded animate-pulse w-3/4" />
								<div className="h-4 bg-muted rounded animate-pulse w-1/2" />
							</div>
						</div>
					</div>
				))}
			</div>
		);
	}

	if (error) {
		return (
			<div className="text-center py-8">
				<p className="text-muted-foreground">Failed to load articles</p>
			</div>
		);
	}

	if (!articles || articles.length === 0) {
		return (
			<Empty>
				<EmptyHeader>
					<EmptyMedia variant="icon">
						<FileText />
					</EmptyMedia>
					<EmptyTitle>No Articles</EmptyTitle>
					<EmptyDescription>
						There are no articles available at the moment.
					</EmptyDescription>
				</EmptyHeader>
			</Empty>
		);
	}

	return (
		<div className="space-y-0">
			{articles.map((article) => (
				<ArticleCard key={article.id} article={article} />
			))}
		</div>
	);
};
