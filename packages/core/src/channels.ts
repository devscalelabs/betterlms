import { prisma } from "@betterlms/database";

export async function findPublicChannels() {
	return await prisma.channel.findMany({
		where: {
			isPrivate: false,
		},
		include: {
			members: {
				include: {
					user: {
						select: {
							id: true,
							name: true,
							username: true,
							imageUrl: true,
						},
					},
				},
			},
			_count: {
				select: {
					posts: true,
				},
			},
		},
	});
}

export async function findAllChannels() {
	return await prisma.channel.findMany({
		include: {
			members: {
				include: {
					user: {
						select: {
							id: true,
							name: true,
							username: true,
							imageUrl: true,
						},
					},
				},
			},
			_count: {
				select: {
					posts: true,
				},
			},
		},
		orderBy: {
			createdAt: "desc",
		},
	});
}

export async function createChannel(name: string, isPrivate: boolean) {
	return await prisma.channel.create({
		data: {
			name,
			isPrivate,
		},
	});
}

export async function addChannelMember(userId: string, channelId: string) {
	return await prisma.channelMember.create({
		data: {
			userId,
			channelId,
		},
	});
}

export async function findChannelById(id: string) {
	return await prisma.channel.findUnique({
		where: { id },
		include: {
			members: {
				include: {
					user: {
						select: {
							id: true,
							name: true,
							username: true,
							imageUrl: true,
						},
					},
				},
			},
			posts: {
				include: {
					user: {
						select: {
							id: true,
							name: true,
							username: true,
							imageUrl: true,
						},
					},
				},
				orderBy: {
					createdAt: "desc",
				},
			},
		},
	});
}

export async function findChannelMember(userId: string, channelId: string) {
	return await prisma.channelMember.findUnique({
		where: {
			userId_channelId: {
				userId,
				channelId,
			},
		},
	});
}

export async function removeChannelMember(userId: string, channelId: string) {
	return await prisma.channelMember.delete({
		where: {
			userId_channelId: {
				userId,
				channelId,
			},
		},
	});
}

export async function updateChannel(
	id: string,
	data: { name?: string; isPrivate?: boolean },
) {
	const updateData: { name?: string; isPrivate?: boolean } = {};
	if (data.name !== undefined) updateData.name = data.name;
	if (data.isPrivate !== undefined) updateData.isPrivate = data.isPrivate;

	return await prisma.channel.update({
		where: { id },
		data: updateData,
	});
}
