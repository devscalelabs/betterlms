import { BrowserRouter, Route, Routes } from "react-router";
import { ProtectedRoute } from "../components/protected-route";
import { AppSettingsPageWrapper } from "../pages/app-settings";
import { ArticlesPage } from "../pages/articles";
import { ChannelMembersPage } from "../pages/channel-members";
import { ChannelsPage } from "../pages/channels";
import { CoursesPage } from "../pages/courses";
import { CreateArticlePage } from "../pages/create-article";
import { CreateCoursePage } from "../pages/create-course";
import { CreateEventPage } from "../pages/create-event";
import { DashboardPage } from "../pages/dashboard";
import { EditArticlePage } from "../pages/edit-article";
import { EditCoursePage } from "../pages/edit-course";
import { EditEventPage } from "../pages/edit-event";
import { EditLessonPage } from "../pages/edit-lesson";
import { EventsPage } from "../pages/events";
import { LoginPage } from "../pages/login";
import { UsersPage } from "../pages/users";

export const AppRouter = () => {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<LoginPage />} />
				<Route
					path="/dashboard"
					element={
						<ProtectedRoute>
							<DashboardPage />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/dashboard/app-settings"
					element={
						<ProtectedRoute>
							<AppSettingsPageWrapper />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/dashboard/users"
					element={
						<ProtectedRoute>
							<UsersPage />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/dashboard/articles"
					element={
						<ProtectedRoute>
							<ArticlesPage />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/dashboard/articles/create"
					element={
						<ProtectedRoute>
							<CreateArticlePage />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/dashboard/articles/edit/:articleId"
					element={
						<ProtectedRoute>
							<EditArticlePage />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/dashboard/courses"
					element={
						<ProtectedRoute>
							<CoursesPage />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/dashboard/courses/create"
					element={
						<ProtectedRoute>
							<CreateCoursePage />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/dashboard/courses/:courseId/edit"
					element={
						<ProtectedRoute>
							<EditCoursePage />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/dashboard/events"
					element={
						<ProtectedRoute>
							<EventsPage />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/dashboard/events/create"
					element={
						<ProtectedRoute>
							<CreateEventPage />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/dashboard/events/:id/edit"
					element={
						<ProtectedRoute>
							<EditEventPage />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/dashboard/edit-lesson/:lessonId"
					element={
						<ProtectedRoute>
							<EditLessonPage />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/dashboard/channels"
					element={
						<ProtectedRoute>
							<ChannelsPage />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/dashboard/channels/:id/members"
					element={
						<ProtectedRoute>
							<ChannelMembersPage />
						</ProtectedRoute>
					}
				/>
			</Routes>
		</BrowserRouter>
	);
};
