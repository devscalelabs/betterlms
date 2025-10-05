import { prisma } from "@betterlms/database";

const SAMPLE_CHANNELS = [
	{
		name: "general",
		isPrivate: false,
	},
	{
		name: "javascript",
		isPrivate: false,
	},
	{
		name: "python",
		isPrivate: false,
	},
	{
		name: "ai-and-llms",
		isPrivate: false,
	},
	{
		name: "random",
		isPrivate: false,
	},
	{
		name: "memes",
		isPrivate: false,
	},
];

const SAMPLE_POSTS = [
	{
		channelName: "general",
		content:
			"Hey everyone! 👋 Just joined this platform. Excited to connect with fellow engineers and share knowledge!",
		title: null,
		media: null,
	},
	{
		channelName: "general",
		content:
			"What are you all working on this week? I'm refactoring a legacy codebase and it's... interesting 😅",
		title: null,
		media: null,
	},
	{
		channelName: "javascript",
		content:
			"Hot take: TypeScript has become essential for any serious JavaScript project. The type safety alone saves countless hours of debugging. What's your experience?",
		title: null,
		media: null,
	},
	{
		channelName: "javascript",
		content:
			"Just discovered Bun 1.0 and wow, the performance improvements are insane! Anyone else making the switch from Node?",
		title: null,
		media: [
			{
				url: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800",
				type: "IMAGE" as const,
			},
		],
	},
	{
		channelName: "javascript",
		content:
			"Looking for recommendations on state management libraries for React. Redux feels too heavy for my use case. Tried Zustand and loving the simplicity!",
		title: null,
		media: null,
	},
	{
		channelName: "python",
		content:
			"FastAPI vs Flask in 2024 - which one should I choose for a new API project? Need something that scales well and has good async support.",
		title: null,
		media: null,
	},
	{
		channelName: "python",
		content:
			"Just finished optimizing a Python script that was taking 45 minutes. Now it runs in 3 minutes thanks to multiprocessing and better algorithms. Never skip the profiler!",
		title: null,
		media: [
			{
				url: "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=800",
				type: "IMAGE" as const,
			},
		],
	},
	{
		channelName: "python",
		content:
			"Poetry vs pip + venv - what's your preferred dependency management tool? I've been using Poetry and love the pyproject.toml approach.",
		title: null,
		media: null,
	},
	{
		channelName: "ai-and-llms",
		content:
			"Built my first RAG application using LangChain and it's mind-blowing how well it works. The future of search is definitely here!",
		title: null,
		media: [
			{
				url: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800",
				type: "IMAGE" as const,
			},
		],
	},
	{
		channelName: "ai-and-llms",
		content:
			"GPT-4 vs Claude Sonnet 4 - which one do you prefer for coding tasks? I've been using Claude lately and the code quality is impressive.",
		title: null,
		media: null,
	},
	{
		channelName: "ai-and-llms",
		content:
			"Prompt engineering is becoming a legitimate skill. Anyone else spending way too much time crafting the perfect system prompt? 😄",
		title: null,
		media: null,
	},
	{
		channelName: "ai-and-llms",
		content:
			"Local LLMs with Ollama are getting really good. Running Llama 3 on my M2 MacBook and it's surprisingly fast!",
		title: null,
		media: [
			{
				url: "https://images.unsplash.com/photo-1655393001768-d946c97d6fd1?w=800",
				type: "IMAGE" as const,
			},
		],
	},
	{
		channelName: "random",
		content:
			"Mechanical keyboards: worth the hype? Just got my first one and my fingers are so happy but my wallet is crying.",
		title: null,
		media: [
			{
				url: "https://images.unsplash.com/photo-1595225476474-87563907a212?w=800",
				type: "IMAGE" as const,
			},
		],
	},
	{
		channelName: "random",
		content: "Coffee or tea while coding? I'm a cold brew enthusiast ☕",
		title: null,
		media: [
			{
				url: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800",
				type: "IMAGE" as const,
			},
		],
	},
	{
		channelName: "memes",
		content:
			"When you finally fix that bug that's been haunting you for 3 days and it was just a missing semicolon... 🤦‍♂️\n\n\"It's not a bug, it's a feature\" - me, trying to convince the PM",
		title: null,
		media: [
			{
				url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800",
				type: "IMAGE" as const,
			},
		],
	},
	{
		channelName: "memes",
		content:
			"Junior dev: carefully writes tests\nSenior dev: console.log() everywhere\nArchitect: implements logging framework\n\nWe are not the same 😂",
		title: null,
		media: [
			{
				url: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800",
				type: "IMAGE" as const,
			},
		],
	},
];

const SAMPLE_REPLIES = [
	{
		parentPostContent: "Hot take: TypeScript has become essential",
		replies: [
			{
				content:
					"Completely agree! We migrated our entire codebase to TypeScript last year and it caught so many bugs before they hit production.",
			},
			{
				content:
					"Unpopular opinion: TypeScript adds too much overhead for small projects. For large teams though, it's a lifesaver.",
			},
			{
				content:
					"The IDE autocomplete alone makes it worth it. VS Code + TypeScript = chef's kiss 👨‍🍳",
			},
		],
	},
	{
		parentPostContent: "Just discovered Bun 1.0",
		replies: [
			{
				content:
					"Been using it for a few weeks now. The speed is incredible but some packages still have compatibility issues.",
			},
			{
				content: "How's the ecosystem support? Is it production-ready?",
			},
		],
	},
	{
		parentPostContent: "FastAPI vs Flask in 2024",
		replies: [
			{
				content:
					"FastAPI for sure. Built-in async support, automatic API docs with Swagger, and Pydantic validation out of the box. It's a no-brainer for new projects.",
			},
			{
				content:
					"I still use Flask for simpler projects. Sometimes you don't need all the bells and whistles.",
			},
			{
				content:
					"We use FastAPI at work. The learning curve is minimal if you know Python, and the performance is noticeably better than Flask.",
			},
		],
	},
	{
		parentPostContent: "GPT-4 vs Claude Sonnet 4",
		replies: [
			{
				content:
					"Claude has been my go-to lately. It tends to write cleaner code and explains its reasoning better.",
			},
			{
				content:
					"GPT-4 is still better for complex algorithms IMO, but Claude is amazing for refactoring and code reviews.",
			},
		],
	},
	{
		parentPostContent: "Local LLMs with Ollama",
		replies: [
			{
				content:
					"How much RAM are you using? I tried running Llama 3 70B and my laptop basically became a space heater 😅",
			},
			{
				content:
					"The 8B models are perfect for local development. Fast enough and still pretty capable!",
			},
		],
	},
	{
		parentPostContent: "Mechanical keyboards: worth the hype?",
		replies: [
			{
				content:
					"Cherry MX Browns gang checking in! Once you go mechanical, you never go back.",
			},
			{
				content:
					"RIP to your coworkers if you work in an office though 😂 Those blue switches are LOUD",
			},
			{
				content:
					"Started with a $50 one, now I have 5 keyboards worth $1000+ total. Send help.",
			},
		],
	},
	{
		parentPostContent: "Coffee or tea while coding?",
		replies: [
			{
				content: "Green tea for focus, coffee for deadlines 💪",
			},
			{
				content: "Energy drinks + lo-fi beats. Don't judge me.",
			},
			{
				content: "Water. Stay hydrated, folks! Your brain will thank you.",
			},
		],
	},
];

async function seedContent() {
	console.log("🌱 Seeding content...");

	// Get users for assignment
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
			where: { id: channel.name },
			update: {},
			create: channel,
		});
		channels.push(created);
		console.log(`✅ Created channel: ${channel.name}`);
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
		console.log(`✅ Added members to channel: ${channel.name}`);
	}

	// Create posts
	console.log("📝 Creating posts...");
	const createdPosts = [];
	for (const post of SAMPLE_POSTS) {
		const channel = channels.find((c) => c.name === post.channelName);
		const randomUser = users[Math.floor(Math.random() * users.length)];

		if (!channel || !randomUser) {
			console.warn("⚠️  Skipping post: missing channel or user");
			continue;
		}

		const createdPost = await prisma.post.create({
			data: {
				...(post.title ? { title: post.title } : {}),
				content: post.content,
				channelId: channel.id,
				userId: randomUser.id,
			},
		});

		createdPosts.push(createdPost);

		// Create media if post has any
		if (post.media && post.media.length > 0) {
			for (const mediaItem of post.media) {
				await prisma.media.create({
					data: {
						url: mediaItem.url,
						type: mediaItem.type,
						userId: randomUser.id,
						postId: createdPost.id,
					},
				});
			}
			console.log(
				`✅ Created post with ${post.media.length} media: ${post.content.slice(0, 30)}...`,
			);
		} else {
			console.log(
				`✅ Created post: ${post.title || post.content.slice(0, 30)}...`,
			);
		}
	}

	// Create replies
	console.log("💬 Creating replies...");
	for (const replyGroup of SAMPLE_REPLIES) {
		const parentPost = createdPosts.find((p) =>
			p.content.startsWith(replyGroup.parentPostContent),
		);

		if (!parentPost) {
			console.warn(
				`⚠️  Skipping replies: parent post not found for "${replyGroup.parentPostContent}"`,
			);
			continue;
		}

		for (const reply of replyGroup.replies) {
			const randomUser = users[Math.floor(Math.random() * users.length)];

			if (!randomUser) {
				console.warn("⚠️  Skipping reply: no user available");
				continue;
			}

			await prisma.post.create({
				data: {
					content: reply.content,
					parentId: parentPost.id,
					channelId: parentPost.channelId,
					userId: randomUser.id,
				},
			});
		}

		// Update reply count on parent post
		await prisma.post.update({
			where: { id: parentPost.id },
			data: { replyCount: replyGroup.replies.length },
		});

		console.log(
			`✅ Created ${replyGroup.replies.length} replies for: ${parentPost.content.slice(0, 40)}...`,
		);
	}

	console.log("✨ Content seeded successfully!");
}

seedContent()
	.catch((error) => {
		console.error("❌ Error seeding content:", error);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
