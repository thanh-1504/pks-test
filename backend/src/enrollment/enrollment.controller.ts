import { Controller, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { Role } from 'generated/prisma/enums';
import { Roles } from 'src/shared/decorators/roles.decorator';
import { User } from 'src/shared/decorators/user.decorator';
import { EnrollmentService } from './enrollment.service';

@Controller()
export class EnrollmentController {
  constructor(private readonly enrollmentService: EnrollmentService) {}

  @Get('enrollments/me')
  getEnrolledCourses(@User('id') userId: number) {
    return this.enrollmentService.getEnrolledCourses(userId);
  }

  @Get('enrollments/my')
  getMyEnrolledCourses(@User('id') userId: number) {
    return this.enrollmentService.getEnrolledCourses(userId);
  }

  @Roles([Role.ADMIN])
  @Get('admin/courses/:id/enrollments')
  getEnrollmentsByCourse(@Param('id', ParseIntPipe) courseId: number) {
    return this.enrollmentService.getEnrollmentsByCourse(courseId);
  }

  @Post('/courses/:id/enroll')
  enrollCourse(
    @User('id') userId: number,
    @Param('id', ParseIntPipe) courseId: number,
  ) {
    return this.enrollmentService.enrollCourse({ userId, courseId });
  }
}
