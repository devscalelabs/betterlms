import { BrowserRouter, Route, Routes } from "react-router";
import { ArticlesPage } from "../pages/articles";
import { CoursesPage } from "../pages/courses";
import { DashboardPage } from "../pages/dashboard";
import { LoginPage } from "../pages/login";
import { UsersPage } from "../pages/users";

export const AppRouter = () => {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<LoginPage />} />
				<Route path="/dashboard" element={<DashboardPage />} />
				<Route path="/dashboard/users" element={<UsersPage />} />
				<Route path="/dashboard/articles" element={<ArticlesPage />} />
				<Route path="/dashboard/courses" element={<CoursesPage />} />
			</Routes>
		</BrowserRouter>
	);
};
