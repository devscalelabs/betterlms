import { prisma } from "@betterlms/database";
import type { Prisma } from "@betterlms/database/generated/prisma";

export async function findEvents(filters: {
  type?: "ONLINE" | "OFFLINE" | undefined;
}) {
  const whereClause: Prisma.EventWhereInput = {};

  if (filters.type) {
    whereClause.type = filters.type;
  }

  return await prisma.event.findMany({
    where: whereClause,
    include: {
      _count: {
        select: {
          participants: true,
        },
      },
    },
    orderBy: {
      date: "asc",
    },
  });
}

export async function findEventById(id: string) {
  return await prisma.event.findUnique({
    where: { id },
    include: {
      participants: {
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
          participants: true,
        },
      },
    },
  });
}

export async function createEvent(data: {
  title: string;
  description?: string | null;
  type?: "ONLINE" | "OFFLINE";
  date: Date;
  url?: string | null;
  city?: string | null;
  address?: string | null;
}) {
  return await prisma.event.create({
    data: {
      title: data.title,
      description: data.description || null,
      type: data.type || "OFFLINE",
      date: data.date,
      url: data.url || null,
      city: data.city || null,
      address: data.address || null,
    },
    include: {
      _count: {
        select: {
          participants: true,
        },
      },
    },
  });
}

export async function updateEvent(id: string, data: {
  title?: string;
  description?: string | null;
  type?: "ONLINE" | "OFFLINE";
  date?: Date;
  url?: string | null;
  city?: string | null;
  address?: string | null;
}) {
  return await prisma.event.update({
    where: { id },
    data,
    include: {
      _count: {
        select: {
          participants: true,
        },
      },
    },
  });
}

export async function deleteEvent(id: string) {
  return await prisma.event.delete({
    where: { id },
  });
}
