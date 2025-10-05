import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { api } from "@/utils/api-client";

type RequestMagicLinkResponse = {
	message: string;
};

type VerifyCodeResponse = {
	token: string;
	user: {
		id: string;
		email: string;
		name: string | null;
		username: string;
	};
};

export const useLogin = () => {
	const [email, setEmail] = useState("");
	const [code, setCode] = useState("");
	const [step, setStep] = useState<"email" | "code">("email");

	// Step 1: Request magic link
	const {
		mutate: requestMagicLink,
		isPending: isRequestingLink,
		isSuccess: linkSent,
	} = useMutation({
		mutationFn: async () => {
			const response = await api
				.post<RequestMagicLinkResponse>("api/v1/auth/login", {
					json: { email },
				})
				.json();
			return response;
		},
		onSuccess: () => {
			setStep("code");
		},
		onError: (error) => {
			console.error("Failed to send magic link:", error);
		},
	});

	// Step 2: Verify code
	const {
		mutate: verifyCode,
		isPending: isVerifying,
		isSuccess: isVerified,
	} = useMutation({
		mutationFn: async () => {
			const response = await api
				.post<VerifyCodeResponse>("api/v1/auth/verify", {
					json: { email, code },
				})
				.json();

			localStorage.setItem("token", response.token);
			return response;
		},
		onSuccess: () => {
			window.location.reload();
		},
		onError: (error) => {
			console.error("Failed to verify code:", error);
		},
	});

	const resetFlow = () => {
		setEmail("");
		setCode("");
		setStep("email");
	};

	return {
		email,
		setEmail,
		code,
		setCode,
		step,
		requestMagicLink,
		isRequestingLink,
		linkSent,
		verifyCode,
		isVerifying,
		isVerified,
		resetFlow,
	};
};
