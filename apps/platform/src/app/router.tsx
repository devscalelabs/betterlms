import { BrowserRouter, Route, Routes } from "react-router";
import { Layout } from "../components/layout";
import { Register } from "../pages/register";
import { Timeline } from "../pages/timeline";

export const AppRouter = () => {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/register" element={<Register />} />
				<Route element={<Layout />}>
					<Route path="/" element={<Timeline />} />
				</Route>
			</Routes>
		</BrowserRouter>
	);
};
