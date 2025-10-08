import { prisma } from "@betterlms/database";
import type { Prisma } from "@betterlms/database/generated/prisma";

export async function findEventParticipants(filters: {
  userId?: string | undefined;
  eventId?: string | undefined;
}) {
  const whereClause: Prisma.EventParticipantWhereInput = {};

  if (filters.userId) {
    whereClause.userId = filters.userId;
  }

  if (filters.eventId) {
    whereClause.eventId = filters.eventId;
  }

  return await prisma.eventParticipant.findMany({
    where: whereClause,
    include: {
      user: {
        select: {
          id: true,
          name: true,
          username: true,
          imageUrl: true,
        },
      },
      event: {
        select: {
          id: true,
          title: true,
          date: true,
          type: true,
        },
      },
    },
    orderBy: {
      joinedAt: "desc",
    },
  });
}

export async function findEventParticipantByUserAndEvent(userId: string, eventId: string) {
  return await prisma.eventParticipant.findUnique({
    where: {
      userId_eventId: {
        userId,
        eventId,
      },
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          username: true,
          imageUrl: true,
        },
      },
      event: {
        select: {
          id: true,
          title: true,
          date: true,
          type: true,
        },
      },
    },
  });
}

export async function createEventParticipant(data: {
  userId: string;
  eventId: string;
}) {
  // Check if user is already participating
  const existing = await findEventParticipantByUserAndEvent(data.userId, data.eventId);
  if (existing) {
    throw new Error("User is already participating in this event");
  }

  return await prisma.eventParticipant.create({
    data: {
      userId: data.userId,
      eventId: data.eventId,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          username: true,
          imageUrl: true,
        },
      },
      event: {
        select: {
          id: true,
          title: true,
          date: true,
          type: true,
        },
      },
    },
  });
}

export async function deleteEventParticipant(userId: string, eventId: string) {
  return await prisma.eventParticipant.delete({
    where: {
      userId_eventId: {
        userId,
        eventId,
      },
    },
  });
}
