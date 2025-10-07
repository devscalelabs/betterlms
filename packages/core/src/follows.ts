import { prisma } from "@betterlms/database";

export async function findUserFollow(followerId: string, followingId: string) {
	return await prisma.userFollow.findUnique({
		where: {
			followerId_followingId: {
				followerId,
				followingId,
			},
		},
	});
}

export async function createUserFollow(
	followerId: string,
	followingId: string,
) {
	return await prisma.userFollow.create({
		data: {
			followerId,
			followingId,
		},
	});
}

export async function deleteUserFollow(
	followerId: string,
	followingId: string,
) {
	return await prisma.userFollow.delete({
		where: {
			followerId_followingId: {
				followerId,
				followingId,
			},
		},
	});
}
