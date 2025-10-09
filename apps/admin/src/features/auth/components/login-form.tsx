import { Button, Input } from "@betterlms/ui";
import { Lock } from "lucide-react";
import { useId } from "react";
import { useLogin } from "../hooks/use-login";

export const LoginForm = () => {
	const emailId = useId();
	const passwordId = useId();

	const {
		email,
		setEmail,
		password,
		setPassword,
		error,
		login,
		isLoggingIn,
		clearError,
	} = useLogin();

	return (
		<form
			className="space-y-6"
			onSubmit={(e) => {
				e.preventDefault();
				login();
			}}
		>
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
					value={email}
					onChange={(e) => {
						setEmail(e.target.value);
						if (error) clearError();
					}}
					required
					autoFocus
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
					placeholder="Enter your password"
					value={password}
					onChange={(e) => {
						setPassword(e.target.value);
						if (error) clearError();
					}}
					required
					className="w-full"
				/>
			</div>

			{error && (
				<div className="p-3 bg-red-50 border border-red-200 rounded-md">
					<p className="text-sm text-red-600">{error}</p>
				</div>
			)}

			<Button
				type="submit"
				className="w-full"
				disabled={isLoggingIn || !email || !password}
			>
				{isLoggingIn ? (
					"Signing in..."
				) : (
					<>
						<Lock className="mr-2 h-4 w-4" />
						Sign In
					</>
				)}
			</Button>
		</form>
	);
};
