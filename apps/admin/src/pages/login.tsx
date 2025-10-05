import { Button, Card, Input } from "@betterlms/ui";
import { useId } from "react";

export const LoginPage = () => {
	const emailId = useId();
	const passwordId = useId();

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-50">
			<Card className="w-full max-w-md p-8">
				<div className="mb-8 text-center">
					<h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
					<p className="text-sm text-gray-600 mt-2">
						Sign in to manage your platform
					</p>
				</div>

				<form className="space-y-6">
					<div className="space-y-2">
						<label
							htmlFor={emailId}
							className="block text-sm font-medium text-gray-700"
						>
							Email
						</label>
						<Input
							id={emailId}
							type="email"
							placeholder="admin@example.com"
							className="w-full"
						/>
					</div>

					<div className="space-y-2">
						<label
							htmlFor={passwordId}
							className="block text-sm font-medium text-gray-700"
						>
							Password
						</label>
						<Input
							id={passwordId}
							type="password"
							placeholder="••••••••"
							className="w-full"
						/>
					</div>

					<Button type="submit" className="w-full">
						Sign In
					</Button>
				</form>
			</Card>
		</div>
	);
};
