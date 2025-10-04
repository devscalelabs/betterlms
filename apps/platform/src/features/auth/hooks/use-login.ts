import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { api } from "@/utils/api-client";

type LoginResponse = {
	token: string;
};

export const useLogin = () => {
	const [formData, setFormData] = useState({
		email: "",
		password: "",
	});

	const { mutate: login, isPending: isLoggingIn } = useMutation({
		mutationFn: async () => {
			const response = await api
				.post<LoginResponse>("api/v1/auth/login", {
					json: formData,
				})
				.json();

			localStorage.setItem("token", response.token);
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
