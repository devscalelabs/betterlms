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

export const LoginDialog = () => {
	return (
		<div>
			<Dialog>
				<DialogTrigger>
					<Button>Login</Button>
				</DialogTrigger>
				<DialogContent className="w-[400px]">
					<DialogHeader>
						<DialogTitle className="text-center">Login</DialogTitle>
						<DialogDescription className="text-center">
							Login to your account
						</DialogDescription>
						<form className="space-y-2">
							<Input placeholder="Email" />
							<Input placeholder="Password" />
							<Button className="w-full">Login</Button>
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
