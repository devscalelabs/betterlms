import { cors } from "@elysiajs/cors";
import { node } from "@elysiajs/node";
import { Elysia } from "elysia";
import { authRouter } from "./v1/router/auth";

const PORT = process.env.BACKEND_PORT || 8000;

export const app = new Elysia({ adapter: node() })
	.use(cors())
	.group("/api/v1", (app) => app.use(authRouter))
	.get("/", () => "Hello Elysia")
	.listen(PORT, ({ hostname, port }) => {
		console.log(`🦊 Elysia is running at ${hostname}:${port}`);
	});
