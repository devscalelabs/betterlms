import { Card, CardContent } from "@betterlms/ui";
import {
	Github01FreeIcons,
	Notification01FreeIcons,
	TissuePaperFreeIcons,
	Video01FreeIcons,
	ZapFreeIcons,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useQueryState } from "nuqs";
import { useNavigate } from "react-router";
import { ChannelsList } from "@/features/channels/components/channels-list";
import { useNotifications } from "@/features/notifications/hooks/use-notifications";
import { MenuItem } from "./shared/menu-item";

export const SidebarLeft = () => {
	const navigate = useNavigate();
	const [_, setChannel] = useQueryState("channel");
	const { unreadCount } = useNotifications();

	return (
		<aside className="sticky top-0 h-screen w-54 pr-4 flex flex-col justify-between pb-4">
			<section className="space-y-2">
				<button
					type="button"
					className="ml-2 h-14 flex gap-2 items-center font-medium pr-4 cursor-pointer w-full"
					onClick={() => {
						setChannel(null);
						navigate("/");
					}}
				>
					<div className="size-8 flex items-center justify-center bg-primary text-primary-foreground rounded-full">
						D
					</div>
					<div>BetterLMS</div>
				</button>
				<nav className="space-y-1">
					<MenuItem
						onClick={() => {
							setChannel(null);
							navigate("/");
						}}
					>
						<HugeiconsIcon
							icon={ZapFreeIcons}
							strokeWidth={2}
							className="scale-125"
						/>
						<p>Timeline</p>
					</MenuItem>
					<MenuItem onClick={() => navigate("/articles")}>
						<HugeiconsIcon
							icon={TissuePaperFreeIcons}
							strokeWidth={2}
							className="scale-125"
						/>
						<p>Articles</p>
					</MenuItem>
					<MenuItem onClick={() => navigate("/courses")}>
						<HugeiconsIcon
							icon={Video01FreeIcons}
							strokeWidth={2}
							className="scale-125"
						/>
						<p>Courses</p>
					</MenuItem>
					<MenuItem onClick={() => navigate("/notifications")}>
						<HugeiconsIcon
							icon={Notification01FreeIcons}
							strokeWidth={2}
							className="scale-125"
						/>
						<p>Notifications</p>
						{unreadCount > 0 && (
							<div className="border border-emerald-400 w-5 h-5 text-xs font-bold bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center">
								{unreadCount > 99 ? "99+" : unreadCount}
							</div>
						)}
					</MenuItem>
				</nav>
				<div className="pt-2">
					<ChannelsList />
				</div>
			</section>
			<section className="space-y-2">
				<div className="ml-2 flex flex-wrap gap-2 text-xs font-medium">
					<div>About</div>
					<div>Support</div>
					<div>Help</div>
				</div>
				<Card className="p-5 bg-gradient-to-bl from-indigo-500/10 to-primary/5">
					<CardContent className="p-0">
						<div className="text-xs">
							BetterLMS is built with ❤️
							<a
								href="https://github.com/devscalelabs/betterlms"
								target="_blank"
								rel="noopener noreferrer"
								className="text-blue-600 underline flex items-center gap-1"
							>
								<HugeiconsIcon
									icon={Github01FreeIcons}
									strokeWidth={2}
									className="scale-125"
									size={12}
								/>
								Devscalelabs
							</a>
						</div>
					</CardContent>
				</Card>
			</section>
		</aside>
	);
};
