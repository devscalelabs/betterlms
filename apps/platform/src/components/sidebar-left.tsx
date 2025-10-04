import { Zap } from "lucide-react";

export const SidebarLeft = () => {
	return (
		<aside className="w-56">
			<header className="h-14 flex gap-2 items-center font-medium pr-4">
				<div className="size-8 flex items-center justify-center bg-primary text-primary-foreground rounded-full">
					<Zap size={14} />
				</div>
				<div>BetterLMS</div>
			</header>
		</aside>
	);
};
