import { Switch, useTheme } from "@betterlms/ui";
import { AccountCard } from "@/features/account/components/account";
import { useAccount } from "@/features/account/hooks/use-account";
import { LoginDialog } from "@/features/auth/components/login";
import { EventList } from "@/features/events/components/event-list";
import { HeadingBox } from "./shared/heading-box";

export const SidebarRight = () => {
	const { account } = useAccount();
	const { theme, setTheme } = useTheme();

	return (
		<aside className="sticky top-0 h-screen w-90 border-r border-border overflow-auto">
			<HeadingBox>
				<Switch
					checked={theme === "dark"}
					onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
				/>
				{account ? <AccountCard account={account.user} /> : <LoginDialog />}
			</HeadingBox>
			<EventList />
		</aside>
	);
};
