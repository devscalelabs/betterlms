import { prisma } from "@betterlms/database";
import type { Prisma } from "@betterlms/database/generated/prisma";

export async function findEvents(filters: {
	type?: "ONLINE" | "OFFLINE" | undefined;
}) {
	const whereClause: Prisma.EventWhereInput = {};

	if (filters.type) {
		whereClause.type = filters.type;
	}

	const events = await prisma.event.findMany({
		where: whereClause,
		include: {
			_count: {
				select: {
					participants: true,
				},
			},
		},
	});

	// Sort events: upcoming first (closest first), then past events (most recent first)
	return events.sort((a, b) => {
		const dateA = new Date(a.date).getTime();
		const dateB = new Date(b.date).getTime();
		const now = Date.now();

		// Both events are in the future - sort by closest date first
		if (dateA >= now && dateB >= now) {
			return dateA - dateB;
		}

		// Event A is in future, B is in past - A comes first
		if (dateA >= now && dateB < now) {
			return -1;
		}

		// Event B is in future, A is in past - B comes first
		if (dateA < now && dateB >= now) {
			return 1;
		}

		// Both events are in the past - sort by most recent first
		return dateB - dateA;
	});
}

export async function findEventById(id: string) {
	return await prisma.event.findUnique({
		where: { id },
		include: {
			participants: {
				include: {
					user: {
						select: {
							id: true,
							name: true,
							username: true,
							imageUrl: true,
						},
					},
				},
			},
			_count: {
				select: {
					participants: true,
				},
			},
		},
	});
}

export async function createEvent(data: {
	title: string;
	description?: string | null;
	type?: "ONLINE" | "OFFLINE";
	date: Date;
	url?: string | null;
	city?: string | null;
	address?: string | null;
}) {
	return await prisma.event.create({
		data: {
			title: data.title,
			description: data.description || null,
			type: data.type || "OFFLINE",
			date: data.date,
			url: data.url || null,
			city: data.city || null,
			address: data.address || null,
		},
		include: {
			_count: {
				select: {
					participants: true,
				},
			},
		},
	});
}

export async function updateEvent(
	id: string,
	data: {
		title?: string;
		description?: string | null;
		type?: "ONLINE" | "OFFLINE";
		date?: Date;
		url?: string | null;
		city?: string | null;
		address?: string | null;
	},
) {
	return await prisma.event.update({
		where: { id },
		data,
		include: {
			_count: {
				select: {
					participants: true,
				},
			},
		},
	});
}

export async function deleteEvent(id: string) {
	return await prisma.event.delete({
		where: { id },
	});
}
