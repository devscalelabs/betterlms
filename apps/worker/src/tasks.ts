import { prisma } from "@betterlms/database";
import type { Job } from "bullmq";
import { extractMentions } from "./utils";

/**
 * Background task to process mentions in posts
 * This task runs asynchronously to avoid blocking the main API
 */
export async function processMentionsTask(job: Job) {
	const { postId, content, authorId, authorUsername } = job.data;

	console.log(
		`[MENTION TASK] Processing mentions for post ${postId} by ${authorUsername}`,
	);

	try {
		// Extract mentions from post content
		const mentions = extractMentions(content);

		if (mentions.length === 0) {
			console.log(`[MENTION TASK] No mentions found in post ${postId}`);
			return;
		}

		console.log(`[MENTION TASK] Found ${mentions.length} mentions:`, mentions);

		// TODO: Validate that mentioned users exist
		// TODO: Filter out self-mentions (author mentioning themselves)
		// TODO: Add rate limiting to prevent spam

		// Find mentioned users in database
		const mentionedUsers = await prisma.user.findMany({
			where: {
				username: {
					in: mentions,
				},
				isDeleted: false,
			},
			select: {
				id: true,
				username: true,
				name: true,
			},
		});

		console.log(
			`[MENTION TASK] Found ${mentionedUsers.length} valid users to notify`,
		);

		// Create notifications for each mentioned user
		const notifications = await Promise.all(
			mentionedUsers.map(async (user) => {
				// Skip if user is mentioning themselves
				if (user.id === authorId) {
					console.log(
						`[MENTION TASK] Skipping self-mention for user ${user.username}`,
					);
					return null;
				}

				return prisma.notification.create({
					data: {
						type: "MENTION",
						recipientId: user.id,
						actorId: authorId,
						postId: postId,
						title: "You were mentioned in a post",
						message: `${authorUsername} mentioned you in a post`,
						metadata: {
							postId,
							authorId,
							authorUsername,
							mentionedUsername: user.username,
						},
					},
				});
			}),
		);

		// Filter out null values (self-mentions)
		const createdNotifications = notifications.filter(Boolean);

		console.log(
			`[MENTION TASK] Created ${createdNotifications.length} notifications for post ${postId}`,
		);

		// TODO: Send real-time notifications (WebSocket/SSE)
		// TODO: Send email notifications if user has email notifications enabled
		// TODO: Add push notifications for mobile apps

		return {
			success: true,
			mentionsFound: mentions.length,
			validUsers: mentionedUsers.length,
			notificationsCreated: createdNotifications.length,
		};
	} catch (error) {
		console.error(
			`[MENTION TASK] Error processing mentions for post ${postId}:`,
			error,
		);
		throw error;
	}
}

/**
 * Background task to send email notifications
 * TODO: Implement email notification system
 */
export async function sendEmailNotificationTask(job: Job) {
	const { notificationId, recipientEmail, notificationType } = job.data;

	console.log(
		`[EMAIL TASK] Sending ${notificationType} notification to ${recipientEmail}`,
	);

	// TODO: Implement email sending logic
	// TODO: Use email service from @betterlms/email package
	// TODO: Handle email templates
	// TODO: Add email delivery tracking

	return {
		success: true,
		notificationId,
		recipientEmail,
		notificationType,
	};
}
