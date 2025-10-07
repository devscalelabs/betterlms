import { Button } from "@betterlms/ui";
import {
	Notification01FreeIcons,
	SettingsIcon,
	TissuePaperFreeIcons,
	Video01FreeIcons,
	ZapFreeIcons,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useQueryState } from "nuqs";
import { useNavigate } from "react-router";

export const MobileMenu = () => {
	const navigate = useNavigate();
	const [_, setChannel] = useQueryState("channel");

	const handleNavigation = (callback: () => void) => {
		callback();
	};

	return (
		<nav className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border md:hidden">
			<div className="flex items-center justify-around py-2">
				<Button
					variant="ghost"
					size="sm"
					className="flex flex-col items-center gap-1 h-auto py-2 px-3"
					onClick={() =>
						handleNavigation(() => {
							setChannel(null);
							navigate("/");
						})
					}
				>
					<HugeiconsIcon icon={ZapFreeIcons} size={20} />
					<span className="text-xs">Timeline</span>
				</Button>
				<Button
					variant="ghost"
					size="sm"
					className="flex flex-col items-center gap-1 h-auto py-2 px-3"
					onClick={() => handleNavigation(() => navigate("/articles"))}
				>
					<HugeiconsIcon icon={TissuePaperFreeIcons} size={20} />
					<span className="text-xs">Articles</span>
				</Button>
				<Button
					variant="ghost"
					size="sm"
					className="flex flex-col items-center gap-1 h-auto py-2 px-3"
					onClick={() => handleNavigation(() => navigate("/courses"))}
				>
					<HugeiconsIcon icon={Video01FreeIcons} size={20} />
					<span className="text-xs">Courses</span>
				</Button>
				<Button
					variant="ghost"
					size="sm"
					className="flex flex-col items-center gap-1 h-auto py-2 px-3"
				>
					<HugeiconsIcon icon={Notification01FreeIcons} size={20} />
					<span className="text-xs">Alerts</span>
				</Button>
				<Button
					variant="ghost"
					size="sm"
					className="flex flex-col items-center gap-1 h-auto py-2 px-3"
				>
					<HugeiconsIcon icon={SettingsIcon} size={20} />
					<span className="text-xs">Settings</span>
				</Button>
			</div>
		</nav>
	);
};
