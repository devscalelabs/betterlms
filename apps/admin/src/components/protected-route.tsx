import type { PropsWithChildren } from "react";
import { Navigate } from "react-router";
import { useAccount } from "@/features/account/hooks/use-account";

export const ProtectedRoute = ({ children }: PropsWithChildren) => {
	const { account, isAccountLoading } = useAccount();
	const token = localStorage.getItem("token");

	if (isAccountLoading) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-gray-50">
				<div className="text-center">
					<div className="w-12 h-12 border-4 border-gray-300 border-t-gray-900 rounded-full animate-spin mx-auto" />
					<p className="text-sm text-gray-600 mt-4">Loading...</p>
				</div>
			</div>
		);
	}

	if (!token || !account) {
		return <Navigate to="/" replace />;
	}

	return <>{children}</>;
};
