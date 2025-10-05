export type Channel = {
	id: string;
	name: string;
	slug: string | null;
	isPrivate: boolean;
	createdAt: string;
	updatedAt: string;
	members: ChannelMember[];
	_count?: {
		posts: number;
	};
	posts?: Post[];
};

export type ChannelMember = {
	id: string;
	userId: string;
	channelId: string;
	user: {
		id: string;
		name: string;
		username: string;
		imageUrl: string | null;
	};
};

export type Post = {
	id: string;
	title: string | null;
	content: string;
	likeCount: number;
	replyCount: number;
	channelId: string | null;
	userId: string | null;
	parentId: string | null;
	isDeleted: boolean;
	isLiked: boolean;
	createdAt: string;
	updatedAt: string;
	user: {
		id: string;
		name: string;
		username: string;
		imageUrl: string | null;
	} | null;
};

export type ChannelsResponse = {
	channels: Channel[];
};

export type ChannelResponse = {
	channel: Channel;
};

export type CreateChannelRequest = {
	name: string;
	isPrivate?: boolean;
};

export type CreateChannelResponse = {
	channel: Channel;
};

export type JoinChannelResponse = {
	member: ChannelMember;
};

export type LeaveChannelResponse = {
	message: string;
};
