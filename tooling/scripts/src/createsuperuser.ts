import * as readline from "node:readline";
import { prisma } from "@betterlms/database";
import bcrypt from "bcrypt";

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

function validateEmail(email: string): boolean {
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	return emailRegex.test(email);
}

function validateUsername(username: string): boolean {
	// Username should be 3-30 characters, alphanumeric and underscores only
	const usernameRegex = /^[a-zA-Z0-9_]{3,30}$/;
	return usernameRegex.test(username);
}

function validatePassword(password: string): boolean {
	// Password should be at least 8 characters
	return password.length >= 8;
}

async function createSuperuser() {
	console.log("🔐 Create Superuser");
	console.log("==================\n");

	try {
		// Get username
		let username: string;
		while (true) {
			username = await askQuestion("Username: ");
			if (!username.trim()) {
				console.log("❌ Username cannot be empty. Please try again.\n");
				continue;
			}
			if (!validateUsername(username)) {
				console.log(
					"❌ Username must be 3-30 characters long and contain only letters, numbers, and underscores.\n",
				);
				continue;
			}

			// Check if username already exists
			const existingUser = await prisma.user.findUnique({
				where: { username },
			});
			if (existingUser) {
				console.log(
					"❌ Username already exists. Please choose a different username.\n",
				);
				continue;
			}
			break;
		}

		// Get email
		let email: string;
		while (true) {
			email = await askQuestion("Email: ");
			if (!email.trim()) {
				console.log("❌ Email cannot be empty. Please try again.\n");
				continue;
			}
			if (!validateEmail(email)) {
				console.log("❌ Please enter a valid email address.\n");
				continue;
			}

			// Check if email already exists
			const existingUser = await prisma.user.findUnique({
				where: { email },
			});
			if (existingUser) {
				console.log("❌ Email already exists. Please use a different email.\n");
				continue;
			}
			break;
		}

		// Get password
		let password: string;
		while (true) {
			password = await askQuestion("Password: ");
			if (!password) {
				console.log("❌ Password cannot be empty. Please try again.\n");
				continue;
			}
			if (!validatePassword(password)) {
				console.log("❌ Password must be at least 8 characters long.\n");
				continue;
			}
			break;
		}

		// Get name (optional)
		const name = await askQuestion("Full name (optional): ");

		// Hash password
		console.log("\n🔒 Hashing password...");
		const hashedPassword = await bcrypt.hash(password, 12);

		// Create superuser
		console.log("👤 Creating superuser...");
		const superuser = await prisma.user.create({
			data: {
				username,
				email,
				password: hashedPassword,
				name: name.trim() || null,
				role: "ADMIN",
				isEmailVerified: true,
				bio: "Platform Administrator",
			},
		});

		console.log("\n✅ Superuser created successfully!");
		console.log("=================================");
		console.log(`Username: ${superuser.username}`);
		console.log(`Email: ${superuser.email}`);
		console.log(`Role: ${superuser.role}`);
		console.log(`ID: ${superuser.id}`);
		console.log(
			"\n💡 You can now use these credentials to log in as an administrator.",
		);
	} catch (error) {
		console.error("❌ Error creating superuser:", error);
		process.exit(1);
	}
}

createSuperuser()
	.catch((error) => {
		console.error("❌ Fatal error:", error);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
