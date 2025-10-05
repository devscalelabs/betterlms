export type Article = {
	id: string;
	title: string;
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
	channel: {
		id: string;
		name: string;
	} | null;
	Media?: {
		id: string;
		url: string;
		type: "IMAGE" | "VIDEO" | "DOCUMENT";
	}[];
	commentPreview?: {
		users: {
			id: string;
			name: string;
			username: string;
			imageUrl: string | null;
		}[];
		totalCount: number;
	};
};

export type ArticlesResponse = {
	articles: Article[];
};

export type ArticleResponse = {
	article: Article;
};
