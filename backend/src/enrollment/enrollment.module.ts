import { Module } from '@nestjs/common';
import { EnrollmentController } from './enrollment.controller';
import { EnrollmentRepository } from './enrollment.repository';
import { EnrollmentService } from './enrollment.service';
import { CourseRepository } from 'src/course/course.repository';

@Module({
  imports: [],
  controllers: [EnrollmentController],
  providers: [EnrollmentService, EnrollmentRepository,CourseRepository],
  exports: [],
})
export class EnrollmentModule {}
