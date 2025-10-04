import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { apiClient } from "@/utils/api-client";

export const useRegister = () => {
	const [formData, setFormData] = useState({
		name: "",
		username: "",
		email: "",
		password: "",
		confirmPassword: "",
	});

	const { mutate: register, isPending: isRegistering } = useMutation({
		mutationFn: async () => {
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
