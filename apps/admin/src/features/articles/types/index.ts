export type Article = {
	id: string;
	title: string | null;
	content: string;
	likeCount: number;
	replyCount: number;
	channelId: string | null;
	userId: string | null;
	parentId: string | null;
	isDeleted: boolean;
	createdAt: string;
	updatedAt: string;
	user: {
		id: string;
		name: string;
		username: string;
		imageUrl: string | null;
	} | null;
	channel: {
		id: string;
		name: string;
	} | null;
	Media?: {
		id: string;
		url: string;
		type: "IMAGE" | "VIDEO" | "DOCUMENT";
	}[];
};

export type ArticlesResponse = {
	posts: Article[];
};

export type Channel = {
	id: string;
	name: string;
	isPrivate: boolean;
	createdAt: string;
	updatedAt: string;
};
