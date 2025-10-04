import { Button } from "@betterlms/ui";
import { HeadingBox } from "./shared/heading-box";

export const SidebarRight = () => {
	return (
		<aside className="w-80 border-r border-border">
			<HeadingBox>
				<div>SidebarRight</div>
				<Button size="sm">Login</Button>
			</HeadingBox>
		</aside>
	);
};
