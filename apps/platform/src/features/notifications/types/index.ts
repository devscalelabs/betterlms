export interface Notification {
	id: string;
	type:
		| "MENTION"
		| "LIKE"
		| "FOLLOW"
		| "COMMENT"
		| "COURSE_ENROLLMENT"
		| "COURSE_COMPLETION";
	recipientId: string;
	recipient: {
		id: string;
		name: string;
		username: string;
		imageUrl: string | null;
	};
	actorId: string | null;
	actor: {
		id: string;
		name: string;
		username: string;
		imageUrl: string | null;
	} | null;
	postId: string | null;
	post: {
		id: string;
		title: string;
		content: string;
	} | null;
	title: string;
	message: string;
	isRead: boolean;
	metadata: Record<string, unknown> | null;
	createdAt: string;
	updatedAt: string;
}

export interface NotificationsResponse {
	notifications: Notification[];
}

export interface MarkReadResponse {
	message: string;
}

export interface MarkAllReadResponse {
	message: string;
}
