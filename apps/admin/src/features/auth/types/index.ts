export interface LoginResponse {
	token: string;
	user: {
		id: string;
		email: string;
		name: string;
		username: string;
		role: string;
	};
}

export interface LoginRequest {
	email: string;
	password: string;
}
