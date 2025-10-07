import { DashboardLayout } from "../components/dashboard-layout";
import { EditArticlePage as EditArticlePageComponent } from "../features/articles/components/edit-article-page";

export const EditArticlePage = () => {
	return (
		<DashboardLayout>
			<EditArticlePageComponent />
		</DashboardLayout>
	);
};
