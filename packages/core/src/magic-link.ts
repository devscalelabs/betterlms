import { prisma } from "@betterlms/database";

export function generateCode(): string {
	return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function createMagicLink(
	email: string,
	code: string,
	expiresAt: Date,
) {
	return await prisma.magicLink.create({
		data: {
			email,
			code,
			expiresAt,
		},
	});
}

export async function findUnusedMagicLink(email: string, code: string) {
	return await prisma.magicLink.findFirst({
		where: {
			email,
			code,
			isUsed: false,
		},
	});
}

export async function markMagicLinkAsUsed(id: string) {
	return await prisma.magicLink.update({
		where: { id },
		data: { isUsed: true },
	});
}
