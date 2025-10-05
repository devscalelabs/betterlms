import { cors } from "@elysiajs/cors";
import { node } from "@elysiajs/node";
import { Elysia } from "elysia";
import { accountRouter } from "./v1/router/account";
import { authRouter } from "./v1/router/auth";
import { channelsRouter } from "./v1/router/channels";
import { postsRouter } from "./v1/router/posts";

const PORT = process.env.BACKEND_PORT || 8000;

export const app = new Elysia({ adapter: node() })
	.use(
		cors({
			origin: "http://localhost:3000",
			allowedHeaders: ["Content-Type", "Authorization"],
			methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
		}),
	)
	.group("/api/v1", (app) =>
		app.use(authRouter).use(accountRouter).use(channelsRouter).use(postsRouter),
	)
	.get("/", () => "Hello Elysia")
	.listen(PORT, ({ hostname, port }) => {
		console.log(`🦊 Elysia is running at ${hostname}:${port}`);
	});
