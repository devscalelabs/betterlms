import { execSync } from "node:child_process";

async function seedAll() {
	console.log("🌱 Starting full database seed...\n");

	try {
		console.log("Step 1/5: Seeding users...");
		execSync("pnpm seed:users", { stdio: "inherit", cwd: __dirname });

		console.log("\nStep 2/5: Seeding channels...");
		execSync("pnpm seed:channels", { stdio: "inherit", cwd: __dirname });

		console.log("\nStep 3/5: Seeding content...");
		execSync("pnpm seed:content", { stdio: "inherit", cwd: __dirname });

		console.log("\nStep 4/5: Seeding articles...");
		execSync("pnpm seed:articles", { stdio: "inherit", cwd: __dirname });

		console.log("\nStep 5/5: Seeding courses...");
		execSync("pnpm seed:courses", { stdio: "inherit", cwd: __dirname });

		console.log("\n🎉 All seeds completed successfully!");
	} catch (error) {
		console.error("\n❌ Seeding failed:", error);
		process.exit(1);
	}
}

seedAll();
