import { Queue } from "bullmq";
import IORedis from "ioredis";

// Create Redis connection for queue
const connection = new IORedis({ maxRetriesPerRequest: null });

// Create notification queue
export const notificationQueue = new Queue("notification", { connection });

/**
 * Queue a mention processing task
 * This runs in the background to avoid blocking the API response
 */
export async function queueMentionProcessing(data: {
  postId: string;
  content: string;
  authorId: string;
  authorUsername: string;
}) {
  try {
    const job = await notificationQueue.add("processMentions", data, {
      // Job options
      attempts: 3, // Retry up to 3 times on failure
      backoff: {
        type: "exponential",
        delay: 2000, // Start with 2 second delay
      },
      removeOnComplete: 10, // Keep last 10 completed jobs
      removeOnFail: 50, // Keep last 50 failed jobs
    });

    console.log(
      `[QUEUE] Queued mention processing job ${job.id} for post ${data.postId}`,
    );
    return job;
  } catch (error) {
    console.error(
      `[QUEUE] Failed to queue mention processing for post ${data.postId}:`,
      error,
    );
    throw error;
  }
}

/**
 * Queue an email notification task
 * TODO: Implement email notification queuing
 */
export async function queueEmailNotification(data: {
  notificationId: string;
  recipientEmail: string;
  notificationType: string;
}) {
  try {
    const job = await notificationQueue.add("sendEmailNotification", data, {
      attempts: 3,
      backoff: {
        type: "exponential",
        delay: 5000, // Start with 5 second delay for email
      },
      removeOnComplete: 10,
      removeOnFail: 50,
    });

    console.log(
      `[QUEUE] Queued email notification job ${job.id} for ${data.recipientEmail}`,
    );
    return job;
  } catch (error) {
    console.error(
      `[QUEUE] Failed to queue email notification for ${data.recipientEmail}:`,
      error,
    );
    throw error;
  }
}
