import { prisma } from "@betterlms/database";

const SAMPLE_CHANNELS = [
	{
		name: "General",
		slug: "general",
		color: "#D4E6F0",
		isPrivate: false,
	},
	{
		name: "JavaScript",
		slug: "javascript",
		color: "#F5F5D8",
		isPrivate: false,
	},
	{
		name: "Python",
		slug: "python",
		color: "#D8F0D8",
		isPrivate: false,
	},
	{
		name: "AI & LLMs",
		slug: "ai-and-llms",
		color: "#E8D8F0",
		isPrivate: false,
	},
	{
		name: "Random & Memes",
		slug: "random",
		color: "#F0D8DC",
		isPrivate: false,
	},
];

async function seedChannels() {
	console.log("🌱 Seeding channels...");

	// Get users for channel membership
	const users = await prisma.user.findMany();
	if (users.length === 0) {
		console.error("❌ No users found. Please run seed:users first.");
		process.exit(1);
	}

	// Create channels
	console.log("📢 Creating channels...");
	const channels = [];
	for (const channel of SAMPLE_CHANNELS) {
		const created = await prisma.channel.upsert({
			where: { slug: channel.slug },
			update: {},
			create: channel,
		});
		channels.push(created);
		console.log(`✅ Created channel: ${channel.name} (/${channel.slug})`);
	}

	// Add all users to all public channels
	console.log("👥 Adding members to channels...");
	for (const channel of channels) {
		for (const user of users) {
			await prisma.channelMember.upsert({
				where: {
					userId_channelId: {
						userId: user.id,
						channelId: channel.id,
					},
				},
				update: {},
				create: {
					userId: user.id,
					channelId: channel.id,
				},
			});
		}
		console.log(`✅ Added ${users.length} members to channel: ${channel.name}`);
	}

	console.log("✨ Channels seeded successfully!");
}

seedChannels()
	.catch((error) => {
		console.error("❌ Error seeding channels:", error);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
