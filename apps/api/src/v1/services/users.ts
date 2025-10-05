import { prisma } from "@betterlms/database";

export async function findUserByEmail(email: string) {
	return await prisma.user.findUnique({
		where: { email },
	});
}

export async function findUserById(id: string) {
	return await prisma.user.findUnique({
		where: { id },
	});
}

export async function findUserByUsername(username: string) {
	return await prisma.user.findUnique({
		where: { username },
		select: {
			id: true,
			name: true,
			username: true,
			email: true,
			bio: true,
			imageUrl: true,
			role: true,
			isSuspended: true,
		},
	});
}

export async function findAllUsers() {
	return await prisma.user.findMany({
		select: {
			id: true,
			name: true,
			username: true,
			email: true,
			bio: true,
			imageUrl: true,
			role: true,
			isSuspended: true,
		},
		orderBy: {
			name: "asc",
		},
	});
}

export async function updateUser(
	userId: string,
	data: {
		name?: string;
		bio?: string;
		imageUrl?: string;
	},
) {
	return await prisma.user.update({
		where: { id: userId },
		data,
		select: {
			id: true,
			name: true,
			username: true,
			email: true,
			bio: true,
			imageUrl: true,
			role: true,
		},
	});
}

export async function suspendUser(userId: string) {
	return await prisma.user.update({
		where: { id: userId },
		data: { isSuspended: true },
		select: {
			id: true,
			name: true,
			username: true,
			email: true,
			bio: true,
			imageUrl: true,
			role: true,
			isSuspended: true,
		},
	});
}

export async function unsuspendUser(userId: string) {
	return await prisma.user.update({
		where: { id: userId },
		data: { isSuspended: false },
		select: {
			id: true,
			name: true,
			username: true,
			email: true,
			bio: true,
			imageUrl: true,
			role: true,
			isSuspended: true,
		},
	});
}
