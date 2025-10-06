import * as readline from "node:readline";
import { prisma } from "@betterlms/database";

function askQuestion(query: string): Promise<string> {
	const rl = readline.createInterface({
		input: process.stdin,
		output: process.stdout,
	});

	return new Promise((resolve) => {
		rl.question(query, (answer) => {
			rl.close();
			resolve(answer);
		});
	});
}

async function resetDatabase() {
	console.log("⚠️  WARNING: This will delete ALL data from the database!");
	console.log("This includes:");
	console.log("  - All users");
	console.log("  - All channels");
	console.log("  - All posts and replies");
	console.log("  - All media");
	console.log("  - All channel memberships");
	console.log("  - All courses, sections, and lessons");
	console.log("  - All course enrollments and progress");
	console.log("");

	const answer = await askQuestion('Type "DELETE" (in uppercase) to confirm: ');

	if (answer !== "DELETE") {
		console.log("❌ Operation cancelled. Database was not modified.");
		process.exit(0);
	}

	console.log("\n🗑️  Starting database cleanup...\n");

	try {
		// Delete in order to respect foreign key constraints
		console.log("Deleting post likes...");
		const likesCount = await prisma.postLike.deleteMany();
		console.log(`✅ Deleted ${likesCount.count} post likes`);

		console.log("Deleting user follows...");
		const followsCount = await prisma.userFollow.deleteMany();
		console.log(`✅ Deleted ${followsCount.count} user follows`);

		console.log("Deleting media...");
		const mediaCount = await prisma.media.deleteMany();
		console.log(`✅ Deleted ${mediaCount.count} media records`);

		console.log("Deleting posts...");
		const postsCount = await prisma.post.deleteMany();
		console.log(`✅ Deleted ${postsCount.count} posts`);

		console.log("Deleting channel members...");
		const membersCount = await prisma.channelMember.deleteMany();
		console.log(`✅ Deleted ${membersCount.count} channel memberships`);

		console.log("Deleting channels...");
		const channelsCount = await prisma.channel.deleteMany();
		console.log(`✅ Deleted ${channelsCount.count} channels`);

		// Delete course-related data before users (due to foreign key constraints)
		console.log("Deleting lesson progress...");
		const lessonProgressCount = await prisma.lessonProgress.deleteMany();
		console.log(
			`✅ Deleted ${lessonProgressCount.count} lesson progress records`,
		);

		console.log("Deleting course enrollments...");
		const enrollmentsCount = await prisma.courseEnrollment.deleteMany();
		console.log(`✅ Deleted ${enrollmentsCount.count} course enrollments`);

		console.log("Deleting lessons...");
		const lessonsCount = await prisma.lesson.deleteMany();
		console.log(`✅ Deleted ${lessonsCount.count} lessons`);

		console.log("Deleting sections...");
		const sectionsCount = await prisma.section.deleteMany();
		console.log(`✅ Deleted ${sectionsCount.count} sections`);

		console.log("Deleting courses...");
		const coursesCount = await prisma.course.deleteMany();
		console.log(`✅ Deleted ${coursesCount.count} courses`);

		console.log("Deleting users...");
		const usersCount = await prisma.user.deleteMany();
		console.log(`✅ Deleted ${usersCount.count} users`);

		console.log("\n✨ Database has been reset successfully!");
		console.log("💡 Run 'pnpm seed:all' to populate with sample data again.");
	} catch (error) {
		console.error("❌ Error resetting database:", error);
		process.exit(1);
	}
}

resetDatabase()
	.catch((error) => {
		console.error("❌ Fatal error:", error);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
