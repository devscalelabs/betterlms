import { execSync } from "node:child_process";

async function seedAll() {
	console.log("🌱 Starting full database seed...\n");

	try {
		console.log("Step 1/3: Seeding users...");
		execSync("pnpm seed:users", { stdio: "inherit", cwd: __dirname });

		console.log("\nStep 2/3: Seeding channels...");
		execSync("pnpm seed:channels", { stdio: "inherit", cwd: __dirname });

		console.log("\nStep 3/3: Seeding content...");
		execSync("pnpm seed:content", { stdio: "inherit", cwd: __dirname });

		console.log("\n🎉 All seeds completed successfully!");
	} catch (error) {
		console.error("\n❌ Seeding failed:", error);
		process.exit(1);
	}
}

seedAll();
