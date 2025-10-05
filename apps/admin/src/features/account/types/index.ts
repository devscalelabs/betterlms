export interface Account {
	id: string;
	name: string;
	username: string;
	email: string;
	bio: string;
	imageUrl: string;
	role: string;
}

export interface AccountResponse {
	user: Account;
}
