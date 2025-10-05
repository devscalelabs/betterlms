import { Button, Card, Input } from "@betterlms/ui";
import { ArrowLeft, Mail } from "lucide-react";
import { useId } from "react";
import { useLogin } from "../features/auth/hooks/use-login";

export const LoginPage = () => {
	const emailId = useId();
	const codeId = useId();

	const {
		email,
		setEmail,
		code,
		setCode,
		step,
		requestMagicLink,
		isRequestingLink,
		verifyCode,
		isVerifying,
		resetFlow,
	} = useLogin();

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-50">
			<Card className="w-full max-w-md p-8">
				<div className="mb-8 text-center">
					<h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
					<p className="text-sm text-gray-600 mt-2">
						{step === "email"
							? "Sign in to manage your platform"
							: "Enter the code sent to your email"}
					</p>
				</div>

				{step === "email" ? (
					<form
						className="space-y-6"
						onSubmit={(e) => {
							e.preventDefault();
							requestMagicLink();
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
								onChange={(e) => setEmail(e.target.value)}
								required
								autoFocus
								className="w-full"
							/>
						</div>

						<Button
							type="submit"
							className="w-full"
							disabled={isRequestingLink || !email}
						>
							{isRequestingLink ? (
								"Sending..."
							) : (
								<>
									<Mail className="mr-2 h-4 w-4" />
									Send Magic Link
								</>
							)}
						</Button>
					</form>
				) : (
					<form
						className="space-y-6"
						onSubmit={(e) => {
							e.preventDefault();
							verifyCode();
						}}
					>
						<div className="space-y-2">
							<div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
								<Mail className="h-4 w-4" />
								<span>Code sent to {email}</span>
							</div>
							<label
								htmlFor={codeId}
								className="block text-sm font-medium text-gray-700"
							>
								Verification Code
							</label>
							<Input
								id={codeId}
								type="text"
								placeholder="000000"
								value={code}
								onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
								maxLength={6}
								required
								autoFocus
								className="w-full text-center text-2xl tracking-widest"
							/>
						</div>

						<Button
							type="submit"
							className="w-full"
							disabled={isVerifying || code.length !== 6}
						>
							{isVerifying ? "Verifying..." : "Verify & Sign In"}
						</Button>

						<Button
							type="button"
							variant="ghost"
							className="w-full"
							onClick={resetFlow}
						>
							<ArrowLeft className="mr-2 h-4 w-4" />
							Back to email
						</Button>
					</form>
				)}
			</Card>
		</div>
	);
};
