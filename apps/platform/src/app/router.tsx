import { BrowserRouter, Route, Routes } from "react-router";
import { Layout } from "../components/layout";

export const AppRouter = () => {
	return (
		<BrowserRouter>
			<Routes>
				<Route element={<Layout />}>
					<Route path="/" element={<div>Home</div>} />
				</Route>
			</Routes>
		</BrowserRouter>
	);
};
