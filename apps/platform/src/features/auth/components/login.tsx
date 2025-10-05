import {
	Button,
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
	Input,
	Separator,
} from "@betterlms/ui";
import { useAtom } from "jotai";
import { loginDialogAtom } from "../atoms/login-dialog-atom";
import { useLogin } from "../hooks/use-login";

export const LoginDialog = () => {
	const { formData, setFormData, login, isLoggingIn } = useLogin();
	const [isOpen, setIsOpen] = useAtom(loginDialogAtom);

	return (
		<div>
			<Dialog open={isOpen} onOpenChange={setIsOpen}>
				<DialogTrigger asChild>
					<Button>Login</Button>
				</DialogTrigger>
				<DialogContent className="w-[400px]">
					<DialogHeader>
						<DialogTitle className="text-center">Login</DialogTitle>
						<DialogDescription className="text-center">
							Login to your account
						</DialogDescription>
						<form
							className="space-y-2"
							onSubmit={(e) => {
								e.preventDefault();
								login();
							}}
						>
							<Input
								placeholder="Email"
								value={formData.email}
								onChange={(e) =>
									setFormData({ ...formData, email: e.target.value })
								}
							/>
							<Input
								placeholder="Password"
								value={formData.password}
								onChange={(e) =>
									setFormData({ ...formData, password: e.target.value })
								}
							/>
							<Button className="w-full" type="submit" disabled={isLoggingIn}>
								Login
							</Button>
						</form>
						<Separator className="my-4" decorative />
						<Button variant="outline" className="w-full">
							Continue with Google
						</Button>
						<Button variant="outline" className="w-full">
							Continue with Github
						</Button>
					</DialogHeader>
				</DialogContent>
			</Dialog>
		</div>
	);
};
