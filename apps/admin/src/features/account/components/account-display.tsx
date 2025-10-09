import type { Account } from "../types";

interface AccountDisplayProps {
	account: Account;
}

export const AccountDisplay = ({ account }: AccountDisplayProps) => {
	return (
		<div className="flex items-center gap-3">
			<div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
				<span className="text-sm font-medium text-gray-700">
					{account.name.charAt(0).toUpperCase()}
				</span>
			</div>
			<div className="hidden md:block">
				<p className="text-sm font-medium text-gray-900">{account.name}</p>
				<p className="text-xs text-gray-500">{account.email}</p>
			</div>
		</div>
	);
};
