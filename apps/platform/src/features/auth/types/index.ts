import { z } from "zod/v4";

export type RequestMagicLinkResponse = {
	message: string;
};

export type VerifyCodeResponse = {
	token: string;
	user: {
		id: string;
		email: string;
		name: string | null;
		username: string;
	};
};

export const registerSchema = z
	.object({
		name: z.string().min(3),
		username: z.string().min(4),
		email: z.string().email(),
		password: z.string().min(8),
		confirmPassword: z.string().min(8),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords do not match",
		path: ["confirmPassword"],
	});

export type RegisterSchema = z.infer<typeof registerSchema>;
