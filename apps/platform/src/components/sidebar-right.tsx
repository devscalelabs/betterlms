import { LoginDialog } from "@/features/auth/components/login";
import { HeadingBox } from "./shared/heading-box";

export const SidebarRight = () => {
	return (
		<aside className="w-80 border-r border-border">
			<HeadingBox>
				<div>SidebarRight</div>
				<LoginDialog />
			</HeadingBox>
		</aside>
	);
};
