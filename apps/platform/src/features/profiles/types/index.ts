export interface Profile {
	id: string;
	name: string;
	username: string;
	email: string;
	bio: string;
	imageUrl: string;
	role: string;
	isFollowing?: boolean;
}

export interface ProfileResponse {
	user: Profile;
}

export interface ProfilesResponse {
	users: Profile[];
}
