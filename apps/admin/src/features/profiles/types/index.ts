export interface Profile {
	id: string;
	name: string;
	username: string;
	email: string;
	bio: string;
	imageUrl: string;
	role: string;
	isSuspended: boolean;
}

export interface ProfilesResponse {
	users: Profile[];
}

export interface SuspendUserResponse {
	message: string;
	user: Profile;
}
