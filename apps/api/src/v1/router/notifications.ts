import { Elysia, t } from "elysia";
import { verifyToken } from "../services/jwt";
import {
	findNotificationsByRecipient,
	markAllNotificationsAsRead,
	markNotificationAsRead,
} from "../services/notifications";

export const notificationsRouter = new Elysia({ prefix: "/notifications" })
	.get("/", async ({ headers, status }) => {
		const token = headers.authorization?.split(" ")[1];

		if (!token) {
			return status(401, {
				error: "Unauthorized",
			});
		}

		const userId = await verifyToken(token);
		const notifications = await findNotificationsByRecipient(userId);

		return { notifications };
	})
	.put(
		"/:id/read",
		async ({ params, headers, status }) => {
			const token = headers.authorization?.split(" ")[1];

			if (!token) {
				return status(401, {
					error: "Unauthorized",
				});
			}

			const userId = await verifyToken(token);
			const result = await markNotificationAsRead(params.id, userId);

			if (result.count === 0) {
				return status(404, {
					error: "Notification not found or already marked as read",
				});
			}

			return { message: "Notification marked as read" };
		},
		{
			params: t.Object({
				id: t.String(),
			}),
		},
	)
	.put("/read-all", async ({ headers, status }) => {
		const token = headers.authorization?.split(" ")[1];

		if (!token) {
			return status(401, {
				error: "Unauthorized",
			});
		}

		const userId = await verifyToken(token);
		const result = await markAllNotificationsAsRead(userId);

		return {
			message: `Marked ${result.count} notifications as read`,
		};
	});
