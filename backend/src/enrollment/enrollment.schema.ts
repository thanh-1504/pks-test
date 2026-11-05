import { EnrollmentStatus } from 'generated/prisma/enums';
import z from 'zod';

const EnrollmentSchema = z.object({
  id: z.number().int().positive().optional(),
  userId: z.number().int().positive('ID người dùng không hợp lệ'),
  courseId: z.number().int().positive('ID khóa học không hợp lệ'),
  status: z.nativeEnum(EnrollmentStatus).default(EnrollmentStatus.ACTIVE),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  deletedAt: z.date().nullable().optional(),
});

export const EnrollCourseSchema = EnrollmentSchema.pick({
  userId: true,
  courseId: true,
});
