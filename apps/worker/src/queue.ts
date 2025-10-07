import { Queue } from "bullmq";

export const notificationQueue = new Queue("notification");
