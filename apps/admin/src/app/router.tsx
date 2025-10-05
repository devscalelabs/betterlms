import { BrowserRouter, Route, Routes } from "react-router";

export const AppRouter = () => {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<div>Admin Dashboard</div>} />
			</Routes>
		</BrowserRouter>
	);
};
