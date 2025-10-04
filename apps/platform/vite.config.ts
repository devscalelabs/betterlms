import path from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
	server: {
		port: 3000,
	},
	plugins: [react()],
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "../.."),
		},
	},
});
