import { prisma } from "@betterlms/database";
import bcrypt from "bcrypt";

const SAMPLE_USERS = [
	{
		name: "Sarah Chen",
		username: "sarahchen",
		email: "sarah.chen@devscale.com",
		password: "password123",
		role: "USER" as const,
		bio: "Full Stack Engineer | Building the future of dev communities",
		isEmailVerified: true,
	},
	{
		name: "Marcus Thompson",
		username: "marcusdev",
		email: "marcus@example.com",
		password: "password123",
		role: "USER" as const,
		bio: "Senior Software Engineer @Google | Python & Go enthusiast | Open source contributor",
		isEmailVerified: true,
	},
	{
		name: "Priya Sharma",
		username: "priyacodes",
		email: "priya@example.com",
		password: "password123",
		role: "USER" as const,
		bio: "Staff Engineer @Meta | React & TypeScript | Speaker | Mentor",
		isEmailVerified: true,
	},
	{
		name: "Alex Rivera",
		username: "alexr",
		email: "alex@example.com",
		password: "password123",
		role: "USER" as const,
		bio: "Full Stack Developer | JavaScript lover | Building cool stuff with AI",
		isEmailVerified: true,
	},
	{
		name: "Jordan Kim",
		username: "jordankim",
		email: "jordan@example.com",
		password: "password123",
		role: "USER" as const,
		bio: "Backend Engineer | Python & Rust | ML hobbyist",
		isEmailVerified: true,
	},
	{
		name: "Taylor Anderson",
		username: "taylora",
		email: "taylor@example.com",
		password: "password123",
		role: "USER" as const,
		bio: "Frontend Dev | React, Vue, Svelte | UI/UX enthusiast",
		isEmailVerified: true,
	},
	{
		name: "Sam Patel",
		username: "sampatel",
		email: "sam@example.com",
		password: "password123",
		role: "USER" as const,
		bio: "DevOps Engineer | Kubernetes & AWS | Infrastructure as Code",
		isEmailVerified: true,
	},
	{
		name: "Morgan Lee",
		username: "morganlee",
		email: "morgan@example.com",
		password: "password123",
		role: "USER" as const,
		bio: "AI/ML Engineer | LLMs are fascinating | Previously @OpenAI",
		isEmailVerified: true,
	},
];

async function seedUsers() {
	console.log("🌱 Seeding users...");

	for (const user of SAMPLE_USERS) {
		const hashedPassword = await bcrypt.hash(user.password, 10);

		await prisma.user.upsert({
			where: { email: user.email },
			update: {},
			create: {
				...user,
				password: hashedPassword,
			},
		});

		console.log(`✅ Created user: ${user.username} (${user.role})`);
	}

	console.log("✨ Users seeded successfully!");
}

seedUsers()
	.catch((error) => {
		console.error("❌ Error seeding users:", error);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
