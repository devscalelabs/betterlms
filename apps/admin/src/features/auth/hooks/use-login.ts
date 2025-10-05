import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate } from "react-router";
import { api } from "@/utils/api-client";
import type { LoginRequest, LoginResponse } from "../types";

export const useLogin = () => {
	const navigate = useNavigate();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState<string | null>(null);

	const { mutate: login, isPending: isLoggingIn } = useMutation({
		mutationFn: async (credentials: LoginRequest) => {
			const response = await api
				.post<LoginResponse>("api/v1/auth/login", {
					json: credentials,
				})
				.json();
			return response;
		},
		onSuccess: (data) => {
			localStorage.setItem("token", data.token);
			localStorage.setItem("user", JSON.stringify(data.user));
			setError(null);
			navigate("/dashboard");
		},
		onError: (error: unknown) => {
			console.error("Failed to login:", error);
			const errorMessage =
				(error as { response?: { json?: { error?: string } } })?.response?.json
					?.error || "Login failed. Please try again.";
			setError(errorMessage);
		},
	});

	const handleLogin = () => {
		if (!email || !password) {
			setError("Please enter both email and password");
			return;
		}
		login({ email, password });
	};

	const clearError = () => {
		setError(null);
	};

	return {
		email,
		setEmail,
		password,
		setPassword,
		error,
		login: handleLogin,
		isLoggingIn,
		clearError,
	};
};
