import { Worker } from "bullmq";
import IORedis from "ioredis";

const connection = new IORedis({ maxRetriesPerRequest: null });

export const worker = new Worker(
	"foo",
	async (job) => {
		// Will print { foo: 'bar'} for the first job
		// and { qux: 'baz' } for the second.
		console.log(job.data);
	},
	{ connection },
);

worker.on("completed", (job) => {
	console.log(`${job.id} has completed!`);
});

worker.on("failed", (job, err) => {
	console.log(`${job?.id} has failed with ${err.message}`);
});
