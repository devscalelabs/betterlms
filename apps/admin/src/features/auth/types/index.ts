export interface LoginResponse {
	message: string;
}

export interface VerifyResponse {
	token: string;
	user: {
		id: string;
		email: string;
		name: string;
		username: string;
	};
}
