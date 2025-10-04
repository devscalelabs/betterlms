export interface Account {
	id: string;
	name: string;
	username: string;
	email: string;
	bio: string;
}

export interface AccountResponse {
	user: Account;
}
