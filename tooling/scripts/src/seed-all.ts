import { execSync } from "node:child_process";

async function seedAll() {
  console.log("🌱 Starting full database seed...\n");

  try {
    console.log("Step 1/6: Seeding users...");
    execSync("pnpm seed:users", { stdio: "inherit", cwd: __dirname });

    console.log("\nStep 2/6: Seeding channels...");
    execSync("pnpm seed:channels", { stdio: "inherit", cwd: __dirname });

    console.log("\nStep 3/6: Seeding content...");
    execSync("pnpm seed:content", { stdio: "inherit", cwd: __dirname });

    console.log("\nStep 4/6: Seeding articles...");
    execSync("pnpm seed:articles", { stdio: "inherit", cwd: __dirname });

    console.log("\nStep 5/6: Seeding courses...");
    execSync("pnpm seed:courses", { stdio: "inherit", cwd: __dirname });

    console.log("\nStep 6/6: Seeding events...");
    execSync("pnpm seed:events", { stdio: "inherit", cwd: __dirname });

    console.log("\n🎉 All seeds completed successfully!");
  } catch (error) {
    console.error("\n❌ Seeding failed:", error);
    process.exit(1);
  }
}

seedAll();
