import { Module } from '@nestjs/common';
import { CourseController } from './course.controller';
import { CourseRepository } from './course.repository';
import { CourseService } from './course.service';

@Module({
  imports: [],
  controllers: [CourseController],
  providers: [CourseService, CourseRepository],
  exports: [],
})
export class CourseModule {}
