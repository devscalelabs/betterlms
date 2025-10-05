import { HeadingBox } from "@/components/shared/heading-box";
import { ArticleList } from "@/features/articles/components/article-list";

export const ArticlesPage = () => {
	return (
		<main>
			<HeadingBox>
				<div>Articles</div>
				<div></div>
			</HeadingBox>
			<ArticleList />
		</main>
	);
};
