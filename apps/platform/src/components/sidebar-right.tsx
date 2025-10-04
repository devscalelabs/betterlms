import { AccountCard } from "@/features/account/components/account";
import { useAccount } from "@/features/account/hooks/use-account";
import { LoginDialog } from "@/features/auth/components/login";
import { HeadingBox } from "./shared/heading-box";

export const SidebarRight = () => {
	const { account } = useAccount();

	return (
		<aside className="w-80 border-r border-border">
			<HeadingBox>
				<div>SidebarRight</div>
				{account ? <AccountCard account={account.user} /> : <LoginDialog />}
			</HeadingBox>
		</aside>
	);
};
