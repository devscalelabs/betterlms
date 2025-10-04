import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { z } from "zod/v4";
import { apiClient } from "@/utils/api-client";

const registerSchema = z
	.object({
		name: z.string().min(3),
		username: z.string().min(4),
		email: z.email(),
		password: z.string().min(8),
		confirmPassword: z.string().min(8),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords do not match",
		path: ["confirmPassword"],
	});

type RegisterSchema = z.infer<typeof registerSchema>;

export const useRegister = () => {
	const [formData, setFormData] = useState<RegisterSchema>({
		name: "",
		username: "",
		email: "",
		password: "",
		confirmPassword: "",
	});

	const { mutate: register, isPending: isRegistering } = useMutation({
		mutationFn: async () => {
			registerSchema.parse(formData);

			const response = await apiClient
				.post("api/v1/auth/register", {
					json: formData,
				})
				.json();
			return response;
		},
		onError: (error) => {
			console.error(error);
		},
	});

	return {
		formData,
		setFormData,
		register,
		isRegistering,
	};
};
