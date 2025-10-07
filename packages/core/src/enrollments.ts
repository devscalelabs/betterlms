import { prisma } from "@betterlms/database";
import type { Prisma } from "@betterlms/database/generated/prisma";

export async function findEnrollments(filters: {
  userId?: string;
  courseId?: string;
  status?: "ACTIVE" | "COMPLETED" | "CANCELLED" | "SUSPENDED";
}) {
  const whereClause: Prisma.CourseEnrollmentWhereInput = {};

  if (filters.userId) {
    whereClause.userId = filters.userId;
  }

  if (filters.courseId) {
    whereClause.courseId = filters.courseId;
  }

  if (filters.status) {
    whereClause.status = filters.status;
  }

  return await prisma.courseEnrollment.findMany({
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
      course: {
        select: {
          id: true,
          title: true,
          slug: true,
          thumbnailUrl: true,
          instructor: {
            select: {
              id: true,
              name: true,
              username: true,
            },
          },
        },
      },
      currentLesson: {
        select: {
          id: true,
          title: true,
          order: true,
        },
      },
    },
    orderBy: {
      enrolledAt: "desc",
    },
  });
}

export async function findEnrollmentById(id: string) {
  return await prisma.courseEnrollment.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          username: true,
          imageUrl: true,
        },
      },
      course: {
        include: {
          instructor: {
            select: {
              id: true,
              name: true,
              username: true,
              imageUrl: true,
            },
          },
          sections: {
            include: {
              lessons: {
                select: {
                  id: true,
                  title: true,
                  order: true,
                  type: true,
                  isFree: true,
                },
                orderBy: {
                  order: "asc",
                },
              },
            },
            orderBy: {
              order: "asc",
            },
          },
        },
      },
      currentLesson: {
        select: {
          id: true,
          title: true,
          order: true,
        },
      },
      lessonProgress: {
        include: {
          lesson: {
            select: {
              id: true,
              title: true,
              order: true,
            },
          },
        },
        orderBy: {
          lesson: {
            order: "asc",
          },
        },
      },
    },
  });
}

export async function findEnrollmentByUserAndCourse(
  userId: string,
  courseId: string,
) {
  return await prisma.courseEnrollment.findUnique({
    where: {
      userId_courseId: {
        userId,
        courseId,
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
      course: {
        select: {
          id: true,
          title: true,
          slug: true,
          thumbnailUrl: true,
          instructor: {
            select: {
              id: true,
              name: true,
              username: true,
            },
          },
        },
      },
      currentLesson: {
        select: {
          id: true,
          title: true,
          order: true,
        },
      },
    },
  });
}

export async function createEnrollment(data: {
  userId: string;
  courseId: string;
  amountPaid?: number;
  currency?: string;
  paymentMethod?: string;
  transactionId?: string;
}) {
  return await prisma.courseEnrollment.create({
    data: {
      userId: data.userId,
      courseId: data.courseId,
      amountPaid: data.amountPaid ? data.amountPaid : null,
      currency: data.currency || "USD",
      paymentMethod: data.paymentMethod || null,
      transactionId: data.transactionId || null,
      paymentStatus: data.amountPaid ? "PAID" : "PENDING",
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
      course: {
        select: {
          id: true,
          title: true,
          slug: true,
          thumbnailUrl: true,
          instructor: {
            select: {
              id: true,
              name: true,
              username: true,
            },
          },
        },
      },
    },
  });
}

export async function updateEnrollmentStatus(
  id: string,
  status: "ACTIVE" | "COMPLETED" | "CANCELLED" | "SUSPENDED",
) {
  return await prisma.courseEnrollment.update({
    where: { id },
    data: {
      status,
      ...(status === "COMPLETED" && { completedAt: new Date() }),
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
      course: {
        select: {
          id: true,
          title: true,
          slug: true,
          thumbnailUrl: true,
          instructor: {
            select: {
              id: true,
              name: true,
              username: true,
            },
          },
        },
      },
    },
  });
}

export async function updateEnrollmentProgress(
  id: string,
  data: {
    progressPercentage?: number;
    currentLessonId?: string;
    lastAccessedAt?: Date;
  },
) {
  const updateData: {
    progressPercentage?: number;
    currentLessonId?: string;
    lastAccessedAt: Date;
  } = {
    lastAccessedAt: data.lastAccessedAt || new Date(),
  };

  if (data.progressPercentage !== undefined) {
    updateData.progressPercentage = data.progressPercentage;
  }

  if (data.currentLessonId !== undefined) {
    updateData.currentLessonId = data.currentLessonId;
  }

  return await prisma.courseEnrollment.update({
    where: { id },
    data: updateData,
    include: {
      user: {
        select: {
          id: true,
          name: true,
          username: true,
          imageUrl: true,
        },
      },
      course: {
        select: {
          id: true,
          title: true,
          slug: true,
          thumbnailUrl: true,
          instructor: {
            select: {
              id: true,
              name: true,
              username: true,
            },
          },
        },
      },
      currentLesson: {
        select: {
          id: true,
          title: true,
          order: true,
        },
      },
    },
  });
}

export async function deleteEnrollment(id: string) {
  return await prisma.courseEnrollment.delete({
    where: { id },
  });
}
