import { cors } from "@elysiajs/cors";
import { node } from "@elysiajs/node";
import { Elysia } from "elysia";
import { accountRouter } from "./v1/router/account";
import { articlesRouter } from "./v1/router/articles";
import { authRouter } from "./v1/router/auth";
import { channelsRouter } from "./v1/router/channels";
import { coursesRouter } from "./v1/router/courses";
import { enrollmentsRouter } from "./v1/router/enrollments";
import { lessonsRouter } from "./v1/router/lessons";
import { linkPreviewRouter } from "./v1/router/link-preview";
import { mediaRouter } from "./v1/router/media";
import { notificationsRouter } from "./v1/router/notifications";
import { postsRouter } from "./v1/router/posts";
import { profileRouter } from "./v1/router/profile";

const PORT = process.env.BACKEND_PORT || 8000;

export const app = new Elysia({ adapter: node() })
	.use(
		cors({
			origin: true,
			allowedHeaders: ["Content-Type", "Authorization"],
			methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
		}),
	)
	.group("/api/v1", (app) =>
		app
			.use(authRouter)
			.use(accountRouter)
			.use(articlesRouter)
			.use(channelsRouter)
			.use(coursesRouter)
			.use(enrollmentsRouter)
			.use(lessonsRouter)
			.use(mediaRouter)
			.use(notificationsRouter)
			.use(postsRouter)
			.use(profileRouter)
			.use(linkPreviewRouter),
	)
	.get("/", () => "Hello Elysia")
	.listen(PORT, ({ hostname, port }) => {
		console.log(`🦊 Elysia is running at ${hostname}:${port}`);
	});
