import path from "node:path";
import { defineConfig } from "prisma/config";

export default defineConfig({
	schema: path.join("prisma", "schema"),
	migrations: {
		path: path.join("prisma", "migrations"),
	},
	views: {
		path: path.join("prisma", "views"),
	},
	typedSql: {
		path: path.join("prisma", "queries"),
	},
	experimental: {
		adapter: true,
		externalTables: true,
		studio: true,
	},
});
