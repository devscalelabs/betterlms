import { Worker } from "bullmq";
import IORedis from "ioredis";
import { processMentionsTask, sendEmailNotificationTask } from "./tasks";

const connection = new IORedis({ maxRetriesPerRequest: null });

export const notificationWorker = new Worker(
  "notification",
  async (job) => {
    console.log(`[WORKER] Processing job ${job.id} of type ${job.name}`);

    switch (job.name) {
      case "processMentions":
        return await processMentionsTask(job);
      case "sendEmailNotification":
        return await sendEmailNotificationTask(job);
      default:
        throw new Error(`Unknown job type: ${job.name}`);
    }
  },
  {
    connection,
    concurrency: 5, // Process up to 5 jobs concurrently
  },
);

notificationWorker.on("completed", (job) => {
  console.log(`[WORKER] Job ${job.id} (${job.name}) completed successfully`);
});

notificationWorker.on("failed", (job, err) => {
  console.error(`[WORKER] Job ${job?.id} (${job?.name}) failed:`, err.message);
});

notificationWorker.on("error", (err) => {
  console.error(`[WORKER] Worker error:`, err);
});

console.log("[WORKER] Notification worker started and ready to process jobs");
