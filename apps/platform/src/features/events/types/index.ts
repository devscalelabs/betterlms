export interface Event {
	id: string;
	title: string;
	description: string | null;
	type: "ONLINE" | "OFFLINE";
	date: string;
	url: string | null;
	city: string | null;
	address: string | null;
	createdAt: string;
	updatedAt: string;
	participants: EventParticipant[];
	_count: {
		participants: number;
	};
}

export interface EventParticipant {
	userId: string;
	eventId: string;
	user: {
		id: string;
		name: string | null;
		username: string;
		imageUrl: string | null;
	};
	event: {
		id: string;
		title: string;
		date: string;
		type: "ONLINE" | "OFFLINE";
	};
	joinedAt: string;
}

export interface EventsResponse {
	events: Event[];
}

export interface EventResponse {
	event: Event;
}
