import { Outlet } from "react-router";
import { SidebarLeft } from "./sidebar-left";
import { SidebarRight } from "./sidebar-right";

export const Layout = () => {
	return (
		<main className="flex h-screen max-w-7xl mx-auto">
			<SidebarLeft />
			<main className="flex-1 border-x">
				<Outlet />
			</main>
			<SidebarRight />
		</main>
	);
};
