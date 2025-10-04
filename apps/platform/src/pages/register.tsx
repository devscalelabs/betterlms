import { Button, Input } from "@betterlms/ui";
import { useRegister } from "@/features/auth/hooks/use-register";

export const Register = () => {
	const { formData, setFormData, register, isRegistering } = useRegister();

	return (
		<main className="grid grid-cols-2">
			<div className="bg-red-500" />
			<div>
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
					onChange={(e) => setFormData({ ...formData, email: e.target.value })}
				/>
				<Input
					placeholder="Password"
					value={formData.password}
					onChange={(e) =>
						setFormData({ ...formData, password: e.target.value })
					}
				/>
				<Input
					placeholder="Confirm Password"
					value={formData.confirmPassword}
					onChange={(e) =>
						setFormData({ ...formData, confirmPassword: e.target.value })
					}
				/>
				<Button onClick={() => register()} disabled={isRegistering}>
					Register
				</Button>
			</div>
		</main>
	);
};
