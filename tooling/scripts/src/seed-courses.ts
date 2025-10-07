import { prisma } from "@betterlms/database";

const SAMPLE_COURSES = [
	{
		title: "Introduction to JavaScript",
		description: "Learn the fundamentals of JavaScript programming",
		slug: "intro-javascript",
		category: "Programming",
		tags: ["javascript", "programming", "beginner"],
		price: 0,
		isPublished: true,
		isPrivate: false,
		sections: [
			{
				title: "Getting Started",
				order: 1,
				lessons: [
					{
						title: "What is JavaScript?",
						content:
							"<p>JavaScript is a programming language that runs in web browsers and servers.</p>",
						order: 1,
						type: "TEXT" as const,
					},
					{
						title: "Setting up your environment",
						content:
							"<p>Learn how to set up your development environment for JavaScript.</p>",
						order: 2,
						type: "TEXT" as const,
					},
				],
			},
			{
				title: "Basic Concepts",
				order: 2,
				lessons: [
					{
						title: "Variables and Data Types",
						content:
							"<p>Learn about variables, strings, numbers, and booleans in JavaScript.</p>",
						order: 1,
						type: "TEXT" as const,
					},
					{
						title: "Functions",
						content: "<p>How to create and use functions in JavaScript.</p>",
						order: 2,
						type: "TEXT" as const,
					},
				],
			},
		],
	},
	{
		title: "Python for Beginners",
		description: "Start your Python programming journey",
		slug: "python-beginners",
		category: "Programming",
		tags: ["python", "programming", "beginner"],
		price: 0,
		isPublished: true,
		isPrivate: false,
		sections: [
			{
				title: "Python Basics",
				order: 1,
				lessons: [
					{
						title: "Installing Python",
						content:
							"<p>Step-by-step guide to install Python on your computer.</p>",
						order: 1,
						type: "TEXT" as const,
					},
					{
						title: "Your First Program",
						content: "<p>Write and run your first Python program.</p>",
						order: 2,
						type: "TEXT" as const,
					},
				],
			},
			{
				title: "Working with Data",
				order: 2,
				lessons: [
					{
						title: "Lists and Dictionaries",
						content: "<p>Learn about Python's built-in data structures.</p>",
						order: 1,
						type: "TEXT" as const,
					},
					{
						title: "File Handling",
						content: "<p>How to read and write files in Python.</p>",
						order: 2,
						type: "TEXT" as const,
					},
				],
			},
		],
	},
];

async function seedCourses() {
	console.log("🌱 Seeding courses...");

	// Get users for instructor assignment
	const users = await prisma.user.findMany();
	if (users.length === 0) {
		console.error("❌ No users found. Please run seed:users first.");
		process.exit(1);
	}

	// Create courses
	console.log("📚 Creating courses...");
	for (const courseData of SAMPLE_COURSES) {
		const randomUser = users[Math.floor(Math.random() * users.length)];

		if (!randomUser) {
			console.warn("⚠️  Skipping course: no user available");
			continue;
		}

		// Create the course
		const course = await prisma.course.create({
			data: {
				title: courseData.title,
				description: courseData.description,
				slug: courseData.slug,
				category: courseData.category,
				tags: courseData.tags,
				price: courseData.price,
				isPublished: courseData.isPublished,
				isPrivate: courseData.isPrivate,
				instructorId: randomUser.id,
			},
		});

		console.log(`✅ Created course: ${course.title}`);

		// Create sections and lessons
		for (const sectionData of courseData.sections) {
			const section = await prisma.section.create({
				data: {
					title: sectionData.title,
					order: sectionData.order,
					courseId: course.id,
				},
			});

			console.log(`  📁 Created section: ${section.title}`);

			for (const lessonData of sectionData.lessons) {
				await prisma.lesson.create({
					data: {
						title: lessonData.title,
						content: lessonData.content,
						order: lessonData.order,
						type: lessonData.type,
						sectionId: section.id,
					},
				});

				console.log(`    📄 Created lesson: ${lessonData.title}`);
			}
		}
	}

	console.log("✨ Courses seeded successfully!");
}

seedCourses()
	.catch((error) => {
		console.error("❌ Error seeding courses:", error);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
