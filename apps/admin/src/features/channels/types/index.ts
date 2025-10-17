export interface Channel {
	id: string;
	name: string;
	isPrivate: boolean;
	members: ChannelMember[];
	createdAt: string;
	updatedAt: string;
}

export interface ChannelMember {
	id: string;
	userId: string;
	channelId: string;
	joinedAt: string;
	user?: {
		id: string;
		name: string;
		username: string;
		imageUrl?: string | null;
	};
}

export interface CreateChannelRequest {
	name: string;
	isPrivate?: boolean;
}

export interface CreateChannelResponse {
	channel: Channel;
}

export interface ChannelsResponse {
	channels: Channel[];
}

export interface ChannelResponse {
	channel: Channel;
}

export interface JoinChannelResponse {
	member: ChannelMember;
}

export interface ApiError {
	error: string;
}
