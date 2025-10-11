import { serve } from "@hono/node-server";
import app from "./index";

const PORT = Number(process.env.BACKEND_PORT) || 8000;

serve({
	fetch: app.fetch,
	port: PORT,
});

console.log(`✅ Server is running on http://localhost:${PORT}`);
