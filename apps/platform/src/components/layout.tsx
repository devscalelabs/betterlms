import { Outlet } from "react-router";
import { useMobile } from "../hooks/use-mobile";
import { MobileMenu } from "./mobile-menu";
import { SidebarLeft } from "./sidebar-left";
import { SidebarRight } from "./sidebar-right";

export const Layout = () => {
	const isMobile = useMobile();

	return (
		<main className="relative flex min-h-screen max-w-7xl mx-auto">
			{isMobile ? (
				<>
					<MobileMenu />
					<main className="flex-1 w-full pb-16">
						<Outlet />
					</main>
				</>
			) : (
				<>
					<SidebarLeft />
					<main className="flex-1 border-x">
						<Outlet />
					</main>
					<SidebarRight />
				</>
			)}
		</main>
	);
};
