import { node } from "@elysiajs/node";
import { Elysia } from "elysia";

const PORT = process.env.BACKEND_PORT || 8000;

export const app = new Elysia({ adapter: node() })
	.get("/", () => "Hello Elysia")
	.listen(PORT, ({ hostname, port }) => {
		console.log(`🦊 Elysia is running at ${hostname}:${port}`);
	});
