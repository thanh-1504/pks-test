import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/services/prisma.service';
import { EnrollCourseDTO } from './enrollment.dto';

@Injectable()
export class EnrollmentRepository {
  constructor(private readonly prismaService: PrismaService) {}

  getEnrolledCourses(userId: number) {
    return this.prismaService.enrollment.findMany({
      where: {
        userId,
        deletedAt: null,
        course: { deletedAt: null },
      },
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        id: true,
        status: true,
        createdAt: true,
        course: {
          select: {
            id: true,
            name: true,
            category: true,
            instructor: true,
            tuition: true,
          },
        },
      },
    });
  }

  getEnrollmentsByCourse(courseId: number) {
    return this.prismaService.enrollment.findMany({
      where: {
        courseId,
        deletedAt: null,
      },
      select: {
        id: true,
        status: true,
        createdAt: true,
        user: {
          select: {
            fullName: true,
            email: true,
          },
        },
        course: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  isUserEnrolled(payload: EnrollCourseDTO) {
    return this.prismaService.enrollment.findFirst({
      where: {
        userId: payload.userId,
        courseId: payload.courseId,
        deletedAt: null,
      },
    });
  }

  createEnroll(payload: EnrollCourseDTO) {
    const { userId, courseId } = payload;
    return this.prismaService.$transaction(async (tx) => {
      const updated = await tx.$executeRaw`
        UPDATE courses
        SET enrolled_count = enrolled_count + 1
        WHERE id = ${courseId} 
        AND deleted_at IS NULL
        AND is_hidden = false
        AND enrolled_count < capacity`;
      if (updated === 0) return null;
      return tx.enrollment.create({
        data: {
          userId,
          courseId,
        },
        include: {
          course: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });
    });
  }
}
