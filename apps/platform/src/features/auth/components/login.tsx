import {
	Button,
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
	Input,
	InputOTP,
	InputOTPGroup,
	InputOTPSlot,
	Separator,
} from "@betterlms/ui";
import { useAtom } from "jotai";
import { ArrowLeft, Mail } from "lucide-react";
import { loginDialogAtom } from "../atoms/login-dialog-atom";
import { useLogin } from "../hooks/use-login";

export const LoginDialog = () => {
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
	const [isOpen, setIsOpen] = useAtom(loginDialogAtom);

	const handleClose = (open: boolean) => {
		setIsOpen(open);
		if (!open) {
			resetFlow();
		}
	};

	return (
		<div>
			<Dialog open={isOpen} onOpenChange={handleClose}>
				<DialogTrigger asChild>
					<Button>Login</Button>
				</DialogTrigger>
				<DialogContent className="w-[400px]">
					<DialogHeader>
						<DialogTitle className="text-center">
							{step === "email" ? "Login with Magic Link" : "Enter Code"}
						</DialogTitle>
						<DialogDescription className="text-center">
							{step === "email"
								? "Enter your email to receive a magic link"
								: "Enter the 6-digit code sent to your email"}
						</DialogDescription>

						{step === "email" ? (
							<form
								className="space-y-4"
								onSubmit={(e) => {
									e.preventDefault();
									requestMagicLink();
								}}
							>
								<div className="space-y-2">
									<Input
										type="email"
										placeholder="your@email.com"
										value={email}
										onChange={(e) => setEmail(e.target.value)}
										required
										autoFocus
									/>
								</div>
								<Button
									className="w-full"
									type="submit"
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
								className="space-y-4"
								onSubmit={(e) => {
									e.preventDefault();
									verifyCode();
								}}
							>
								<div className="flex flex-col items-center">
									<div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
										<Mail className="h-4 w-4" />
										<span>Code sent to {email}</span>
									</div>
									<InputOTP
										value={code}
										onChange={(value) => setCode(value.replace(/\D/g, ""))}
										maxLength={6}
										autoFocus
									>
										<InputOTPGroup>
											<InputOTPSlot index={0} />
											<InputOTPSlot index={1} />
											<InputOTPSlot index={2} />
										</InputOTPGroup>
										<InputOTPGroup>
											<InputOTPSlot index={3} />
											<InputOTPSlot index={4} />
											<InputOTPSlot index={5} />
										</InputOTPGroup>
									</InputOTP>
								</div>
								<Button
									className="w-full"
									type="submit"
									disabled={isVerifying || code.length !== 6}
								>
									{isVerifying ? "Verifying..." : "Verify & Login"}
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

						<Separator className="my-4" decorative />
						<Button variant="outline" className="w-full" disabled>
							Continue with Google
						</Button>
						<Button variant="outline" className="w-full" disabled>
							Continue with Github
						</Button>
					</DialogHeader>
				</DialogContent>
			</Dialog>
		</div>
	);
};
