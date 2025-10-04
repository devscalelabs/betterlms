import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { apiClient } from "@/utils/api-client";

export const useLogin = () => {
	const [formData, setFormData] = useState({
		email: "",
		password: "",
	});

	const { mutate: login, isPending: isLoggingIn } = useMutation({
		mutationFn: async () => {
			const response = await apiClient
				.post("api/v1/auth/login", {
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
		login,
		isLoggingIn,
	};
};
