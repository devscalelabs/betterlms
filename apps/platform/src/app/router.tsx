import { BrowserRouter, Route, Routes } from "react-router";
import { Layout } from "../components/layout";
import { ArticleDetailPage } from "../pages/article-detail";
import { ArticlesPage } from "../pages/articles";
import { EditProfilePage } from "../pages/edit-profile";
import { PostDetail } from "../pages/post-detail";
import { Profile } from "../pages/profile";
import { Register } from "../pages/register";
import { Timeline } from "../pages/timeline";

export const AppRouter = () => {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/register" element={<Register />} />
				<Route element={<Layout />}>
					<Route path="/" element={<Timeline />} />
					<Route path="/articles" element={<ArticlesPage />} />
					<Route path="/article/:id" element={<ArticleDetailPage />} />
					<Route path="/post/:id" element={<PostDetail />} />
					<Route path="/profile/:username" element={<Profile />} />
					<Route path="/profile/edit" element={<EditProfilePage />} />
				</Route>
			</Routes>
		</BrowserRouter>
	);
};
