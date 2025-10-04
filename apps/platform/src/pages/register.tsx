import { Button, Input } from "@betterlms/ui";
import { useRegister } from "@/features/auth/hooks/use-register";

export const Register = () => {
	const { formData, setFormData, register, isRegistering } = useRegister();

	return (
		<main className="grid grid-cols-2 h-screen">
			<div className="bg-indigo-500" />
			<div className="flex items-center justify-center">
				<div className="w-[360px] space-y-2">
					<h1 className="text-2xl font-bold">Register</h1>
					<p className="text-sm text-gray-500">
						Create an account to get started
					</p>
					<Input
						placeholder="Name"
						value={formData.name}
						onChange={(e) => setFormData({ ...formData, name: e.target.value })}
					/>
					<Input
						placeholder="Username"
						value={formData.username}
						onChange={(e) =>
							setFormData({ ...formData, username: e.target.value })
						}
					/>
					<Input
						placeholder="Email"
						value={formData.email}
						onChange={(e) =>
							setFormData({ ...formData, email: e.target.value })
						}
					/>
					<Input
						type="password"
						placeholder="Password"
						value={formData.password}
						onChange={(e) =>
							setFormData({ ...formData, password: e.target.value })
						}
					/>
					<Input
						type="password"
						placeholder="Confirm Password"
						value={formData.confirmPassword}
						onChange={(e) =>
							setFormData({ ...formData, confirmPassword: e.target.value })
						}
					/>
					<Button
						onClick={() => register()}
						disabled={isRegistering}
						className="w-full"
					>
						Register
					</Button>
				</div>
			</div>
		</main>
	);
};
