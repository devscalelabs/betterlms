import { prisma } from "@betterlms/database";

export async function findNotificationsByRecipient(recipientId: string) {
	return await prisma.notification.findMany({
		where: {
			recipientId,
		},
		include: {
			actor: {
				select: {
					id: true,
					name: true,
					username: true,
					imageUrl: true,
				},
			},
			post: {
				select: {
					id: true,
					title: true,
					content: true,
				},
			},
		},
		orderBy: {
			createdAt: "desc",
		},
	});
}

export async function markNotificationAsRead(
	notificationId: string,
	recipientId: string,
) {
	return await prisma.notification.updateMany({
		where: {
			id: notificationId,
			recipientId, // Ensure user can only mark their own notifications as read
		},
		data: {
			isRead: true,
		},
	});
}

export async function markAllNotificationsAsRead(recipientId: string) {
	return await prisma.notification.updateMany({
		where: {
			recipientId,
			isRead: false,
		},
		data: {
			isRead: true,
		},
	});
}
