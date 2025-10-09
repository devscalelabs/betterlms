import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { api } from "@/utils/api-client";
import { type RegisterSchema, registerSchema } from "../types";

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

			const response = await api
				.post("api/v1/auth/register/", {
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
