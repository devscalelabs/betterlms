import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate } from "react-router";
import { api } from "@/utils/api-client";
import type { LoginResponse, VerifyResponse } from "../types";

export const useLogin = () => {
	const navigate = useNavigate();
	const [email, setEmail] = useState("");
	const [code, setCode] = useState("");
	const [step, setStep] = useState<"email" | "code">("email");

	const { mutate: requestMagicLink, isPending: isRequestingLink } = useMutation(
		{
			mutationFn: async () => {
				const response = await api
					.post<LoginResponse>("api/v1/auth/login", {
						json: { email },
					})
					.json();
				return response;
			},
			onSuccess: () => {
				setStep("code");
			},
			onError: (error) => {
				console.error("Failed to request magic link:", error);
			},
		},
	);

	const { mutate: verifyCode, isPending: isVerifying } = useMutation({
		mutationFn: async () => {
			const response = await api
				.post<VerifyResponse>("api/v1/auth/verify", {
					json: { email, code },
				})
				.json();
			return response;
		},
		onSuccess: (data) => {
			localStorage.setItem("token", data.token);
			navigate("/dashboard");
		},
		onError: (error) => {
			console.error("Failed to verify code:", error);
		},
	});

	const resetFlow = () => {
		setStep("email");
		setCode("");
	};

	return {
		email,
		setEmail,
		code,
		setCode,
		step,
		requestMagicLink,
		isRequestingLink,
		verifyCode,
		isVerifying,
		resetFlow,
	};
};
