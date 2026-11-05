import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from 'generated/prisma/client';
import { CourseRepository } from 'src/course/course.repository';
import { formatDate } from 'src/shared/utils/course.util';
import { EnrollCourseDTO } from './enrollment.dto';
import { EnrollmentRepository } from './enrollment.repository';

@Injectable()
export class EnrollmentService {
  constructor(
    private readonly enrollmentRepo: EnrollmentRepository,
    private readonly courseRepo: CourseRepository,
  ) {}

  async getEnrolledCourses(userId: number) {
    const list = await this.enrollmentRepo.getEnrolledCourses(userId);
    return list.map(({ createdAt, ...enrollment }) => ({
      ...enrollment,
      enrolledAt: formatDate(createdAt),
    }));
  }

  async getEnrollmentsByCourse(courseId: number) {
    const course = await this.courseRepo.getCourseById(courseId);
    if (!course) throw new NotFoundException('Khóa học không tồn tại');
    const list = await this.enrollmentRepo.getEnrollmentsByCourse(courseId);
    return list.map((enrollment) => ({
      id: enrollment.id,
      fullName: enrollment.user.fullName,
      email: enrollment.user.email,
      courseName: enrollment.course.name,
      enrolledAt: formatDate(enrollment.createdAt),
      status: enrollment.status,
    }));
  }

  async enrollCourse(payload: EnrollCourseDTO) {
    const { courseId } = payload;
    const course = await this.courseRepo.getCourseById(courseId);
    if (!course || course.isHidden)
      throw new NotFoundException('Khóa học bạn ghi danh không tồn tại');
    const existed = await this.enrollmentRepo.isUserEnrolled(payload);
    if (existed) throw new ConflictException('Bạn đã đăng ký khóa học này rồi');
    if (course.enrolledCount >= course.capacity)
      throw new ConflictException('Khóa học đã hết chỗ');
    try {
      const enrollment = await this.enrollmentRepo.createEnroll(payload);
      if (!enrollment) throw new ConflictException('Khóa học đã hết chỗ');
      return {
        id: enrollment.id,
        status: enrollment.status,
        enrolledAt: formatDate(enrollment.createdAt),
        course: enrollment.course,
      };
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      )
        throw new ConflictException('Bạn đã đăng ký khóa học này rồi');
      throw error;
    }
  }
}
