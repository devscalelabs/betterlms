import { BrowserRouter, Route, Routes } from "react-router";
import { Layout } from "../components/layout";
import { Timeline } from "../pages/timeline";

export const AppRouter = () => {
	return (
		<BrowserRouter>
			<Routes>
				<Route element={<Layout />}>
					<Route path="/" element={<Timeline />} />
				</Route>
			</Routes>
		</BrowserRouter>
	);
};
